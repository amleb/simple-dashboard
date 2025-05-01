import { Injectable } from '@nestjs/common';
import {
  CreateQueueCommand,
  ListQueuesCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { CreateSqsQueueInput } from './sqs-queue.model';

@Injectable()
export class SqsService {
  async listQueues(
    region: string,
  ): Promise<{ id: string; name: string; region: string }[]> {
    const client = new SQSClient({
      region,
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    const result = await client.send(new ListQueuesCommand({}));

    return (
      result.QueueUrls?.map((url) => {
        const name = url.split('/').pop()!;
        return { id: url, name, region };
      }) || []
    );
  }

  async createQueue(region: string, input: CreateSqsQueueInput) {
    const client = new SQSClient({
      region,
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

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
}
