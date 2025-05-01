import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { SqsService } from './sqs.service';
import { CreateSqsQueueInput, SqsQueue } from './sqs-queue.model';

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

  @Mutation(() => SqsQueue)
  async createSqsQueue(
    @Args('region') region: string,
    @Args('input') input: CreateSqsQueueInput,
  ): Promise<SqsQueue> {
    return this.sqsService.createQueue(region, input);
  }
}
