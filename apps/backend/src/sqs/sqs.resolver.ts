import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { SqsService } from './sqs.service';
import {
  CreateSqsQueueInput,
  SqsQueue,
  SqsQueueWithAttributes,
  UpdateSqsQueueInput,
} from './sqs-queue.model';

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

  @Query(() => SqsQueueWithAttributes, { nullable: true })
  async getSqsQueue(
    @Args('region') region: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<SqsQueueWithAttributes> {
    return this.sqsService.getQueue(region, id);
  }

  @Mutation(() => SqsQueue)
  async createSqsQueue(
    @Args('region') region: string,
    @Args('input') input: CreateSqsQueueInput,
  ): Promise<SqsQueue> {
    return this.sqsService.createQueue(region, input);
  }

  @Mutation(() => SqsQueue)
  async updateSqsQueue(
    @Args('region') region: string,
    @Args('input') input: UpdateSqsQueueInput,
  ): Promise<{ id: string }> {
    return this.sqsService.updateQueue(region, input);
  }

  @Mutation(() => Boolean)
  async deleteSqsQueue(
    @Args('region') region: string,
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.sqsService.deleteQueue(region, id);
  }
}
