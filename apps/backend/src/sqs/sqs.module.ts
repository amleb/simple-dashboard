import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SqsResolver } from './sqs.resolver';

@Module({
  providers: [SqsService, SqsResolver],
})
export class SqsModule {}
