import { Injectable } from '@nestjs/common';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { CreateSqsQueueInput } from './sqs-queue.model';
import AwsClientOptionsFactory from '../lib/aws_client.factory';

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
    const command = new CreateQueueCommand({
      QueueName: input.name,
    });

    const result = await client.send(command);

    return {
      id: result.QueueUrl || '',
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
