import { Injectable } from '@nestjs/common';
import { ListQueuesCommand, SQSClient } from '@aws-sdk/client-sqs';

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
}
