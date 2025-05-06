import { Injectable } from '@nestjs/common';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { CreateSqsQueueInput } from './sqs-queue.model';
import AwsClientOptionsFactory from '../lib/aws_client.factory';
import { omit } from 'lodash';

@Injectable()
export class SqsService {
  private readonly optionsFactory: AwsClientOptionsFactory;

  constructor() {
    this.optionsFactory = new AwsClientOptionsFactory();
  }

  async listQueues(
    region: string,
  ): Promise<{ id: string; name: string; region: string }[]> {
    const client = new SQSClient(this.optionsFactory.createOptions(region));
    const result = await client.send(new ListQueuesCommand({}));

    return (
      result.QueueUrls?.map((url) => {
        const name = url.split('/').pop()!;
        return { id: url, name, region };
      }) || []
    );
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
