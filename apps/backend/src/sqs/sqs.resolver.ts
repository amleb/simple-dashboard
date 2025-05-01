import { Resolver, Query, Args } from '@nestjs/graphql';
import { SqsService } from './sqs.service';
import { SqsQueue } from './sqs-queue.model';

@Resolver(() => SqsQueue)
export class SqsResolver {
  constructor(private readonly sqsService: SqsService) {}

  @Query(() => [SqsQueue])
  async sqsQueues(@Args('region') region: string): Promise<SqsQueue[]> {
    if (typeof region !== 'string' || !region.trim()) {
      throw new Error('Invalid region value');
    }

    return this.sqsService.listQueues(region);
  }
}
