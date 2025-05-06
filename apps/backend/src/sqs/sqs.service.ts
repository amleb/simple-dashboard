import { Injectable } from '@nestjs/common';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueAttributesCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { CreateSqsQueueInput, SqsQueue } from './sqs-queue.model';
import AwsClientOptionsFactory from '../lib/aws_client.factory';
import { omit } from 'lodash';

@Injectable()
export class SqsService {
  private readonly optionsFactory: AwsClientOptionsFactory;

  constructor() {
    this.optionsFactory = new AwsClientOptionsFactory();
  }

  async listQueues(region: string): Promise<SqsQueue[]> {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const { QueueUrls = [] } = await client.send(new ListQueuesCommand({}));

    const queues: SqsQueue[] = [];

    for (const url of QueueUrls) {
      const name = url.split('/').pop()!;
      const { Attributes } = await client.send(
        new GetQueueAttributesCommand({
          QueueUrl: url,
          AttributeNames: ['All'],
        }),
      );

      queues.push({
        id: url,
        name,
        region,
        type: name.endsWith('.fifo') ? 'FIFO' : 'Standard',
        createdAt: Attributes?.CreatedTimestamp
          ? new Date(Number(Attributes.CreatedTimestamp) * 1000)
          : undefined,
        messagesAvailable: Attributes?.ApproximateNumberOfMessages
          ? parseInt(Attributes.ApproximateNumberOfMessages, 10)
          : undefined,
        messagesInFlight: Attributes?.ApproximateNumberOfMessagesNotVisible
          ? parseInt(Attributes.ApproximateNumberOfMessagesNotVisible, 10)
          : undefined,
        encryption: Attributes?.KmsMasterKeyId ? 'KMS' : 'None',
        contentBasedDeduplication:
          Attributes?.ContentBasedDeduplication === 'true',
      });
    }

    return queues;
  }

  async createQueue(region: string, input: CreateSqsQueueInput) {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const attributes: Record<string, string> = {};
    if (input.attributes) {
      for (const [key, value] of Object.entries(input.attributes)) {
        if (value !== undefined && value !== null) {
          attributes[key] = String(value);
        }
      }
    }

    const tags: Record<string, string> = {};
    input.tags?.forEach((tag) => {
      tags[tag.key] = tag.value;
    });

    const command = new CreateQueueCommand({
      QueueName: input.name,
      Attributes:
        attributes.FifoQueue === 'true'
          ? attributes
          : omit(attributes, 'FifoQueue'),
      tags: tags,
    });

    const response = await client.send(command);

    return {
      id: response.QueueUrl || '',
      name: input.name,
      region,
    };
  }

  async deleteQueue(region: string, queueUrl: string) {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const command = new DeleteQueueCommand({ QueueUrl: queueUrl });
    await client.send(command);
    return true;
  }
}
