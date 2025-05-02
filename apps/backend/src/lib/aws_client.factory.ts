import { Injectable } from '@nestjs/common';

@Injectable()
class AwsClientOptionsFactory {
  private static readonly DEFAULT_ENDPOINT = 'http://localhost:4566';
  private static readonly DEFAULT_CREDENTIALS = {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  };

  createOptions(region: string) {
    return {
      region,
      endpoint: AwsClientOptionsFactory.DEFAULT_ENDPOINT,
      credentials: AwsClientOptionsFactory.DEFAULT_CREDENTIALS,
    };
  }
}

export default AwsClientOptionsFactory;
