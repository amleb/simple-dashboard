import { Resolver, Query } from '@nestjs/graphql';
import { SqsService } from './sqs.service';
import { SqsQueue } from './sqs-queue.model';

@Resolver(() => SqsQueue)
export class SqsResolver {
  constructor(private readonly sqsService: SqsService) {}

  @Query(() => [SqsQueue])
  async sqsQueues(): Promise<SqsQueue[]> {
    return this.sqsService.listQueues();
  }
}
