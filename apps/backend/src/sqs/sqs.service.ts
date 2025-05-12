import { Injectable } from '@nestjs/common';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueAttributesCommand,
  ListQueuesCommand,
  QueueAttributeName,
  SetQueueAttributesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  CreateSqsQueueInput,
  QueueAttributesInput,
  SqsQueue,
  SqsQueueWithAttributes,
  UpdateSqsQueueInput,
} from './sqs-queue.model';
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
      const queue = await this.getQueueAttributesForList(client, url, region);
      queues.push(queue);
    }

    return queues;
  }

  async getQueue(region: string, id: string): Promise<SqsQueueWithAttributes> {
    const client = new SQSClient(this.optionsFactory.createOptions(region));

    const { Attributes } = await client.send(
      new GetQueueAttributesCommand({
        QueueUrl: id,
        AttributeNames: ['All'],
      }),
    );

    const name = id.split('/').pop() ?? '';

    return {
      id: id,
      name,
      type: name.endsWith('.fifo') ? 'FIFO' : 'Standard',
      region,
      attributes: Attributes ? this.flattenAttributes(Attributes) : {},
    };
  }

  async createQueue(region: string, input: CreateSqsQueueInput) {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const attributes = this.flattenAttributes(input.attributes);

    const tags: Record<string, string> = {};
    // input.Tags?.forEach((tag) => {
    //   tags[tag.key] = tag.value;
    // });

    const command = new CreateQueueCommand({
      QueueName: input.Name,
      Attributes:
        attributes.FifoQueue === 'true'
          ? omit(attributes, ['Name'])
          : omit(attributes, ['Name', 'FifoQueue']),
      tags: tags,
    });

    const response = await client.send(command);

    return {
      id: response.QueueUrl || '',
      name: input.Name,
      region,
    };
  }

  async updateQueue(
    region: string,
    input: UpdateSqsQueueInput,
  ): Promise<{ id: string }> {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const { id } = input;

    await client.send(
      new SetQueueAttributesCommand({
        QueueUrl: id,
        Attributes: this.flattenAttributes(input.attributes),
      }),
    );

    return {
      id,
    };
  }

  async deleteQueue(region: string, queueUrl: string) {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const command = new DeleteQueueCommand({ QueueUrl: queueUrl });
    await client.send(command);
    return true;
  }

  flattenAttributes(
    attributes:
      | QueueAttributesInput
      | Partial<Record<QueueAttributeName, string>>,
  ) {
    const flattened: Record<string, string> = {};
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        if (value !== undefined && value !== null) {
          flattened[key] = String(value);
        }
      }
    }
    return flattened;
  }

  async getQueueAttributesForList(
    client: SQSClient,
    url: string,
    region: string,
  ): Promise<SqsQueue> {
    const name = url.split('/').pop()!;
    const { Attributes } = await client.send(
      new GetQueueAttributesCommand({
        QueueUrl: url,
        AttributeNames: ['All'],
      }),
    );

    return {
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
    };
  }
}
