import { Injectable } from '@nestjs/common';
import { SQSClient, ListQueuesCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqs = new SQSClient({
    region: 'us-east-1', // Uncomment below for LocalStack:
    endpoint: 'http://localhost:4566',
    credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
  });

  async listQueues(): Promise<{ url: string }[]> {
    const command = new ListQueuesCommand({});
    const response = await this.sqs.send(command);
    return (
      response.QueueUrls?.map((url) => ({
        url,
      })) || []
    );
  }
}
