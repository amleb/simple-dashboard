import { InputType, ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SqsQueue {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  region: string;
}

@InputType()
export class TagInput {
  @Field() key: string;
  @Field() value: string;
}

@InputType()
export class QueueAttributesInput {
  @Field(() => Int, { nullable: true }) DelaySeconds?: number;
  @Field(() => Int, { nullable: true }) MaximumMessageSize?: number;
  @Field(() => Int, { nullable: true }) MessageRetentionPeriod?: number;
  @Field(() => Int, { nullable: true }) ReceiveMessageWaitTimeSeconds?: number;
  @Field(() => Int, { nullable: true }) VisibilityTimeout?: number;
  @Field({ nullable: true }) FifoQueue?: boolean;
  @Field({ nullable: true }) ContentBasedDeduplication?: boolean;
  @Field({ nullable: true }) DeduplicationScope?: string;
  @Field({ nullable: true }) FifoThroughputLimit?: string;
  @Field({ nullable: true }) KmsMasterKeyId?: string;
  @Field(() => Int, { nullable: true }) KmsDataKeyReusePeriodSeconds?: number;
  @Field({ nullable: true }) RedrivePolicy?: string;
  @Field({ nullable: true }) RedriveAllowPolicy?: string;
  @Field({ nullable: true }) SqsManagedSseEnabled?: boolean;
  @Field({ nullable: true }) Policy?: string;
}

@InputType()
export class CreateSqsQueueInput {
  @Field()
  name: string;
  @Field(() => QueueAttributesInput, { nullable: true })
  attributes?: QueueAttributesInput;
  @Field(() => [TagInput], { nullable: true }) tags?: TagInput[];
}
