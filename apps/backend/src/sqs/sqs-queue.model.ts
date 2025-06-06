import { InputType, ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SqsQueue {
  @Field(() => ID)
  id?: string;

  @Field(() => String)
  name?: string;

  @Field(() => String)
  region: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Number, { nullable: true })
  messagesAvailable?: number;

  @Field(() => Number, { nullable: true })
  messagesInFlight?: number;

  @Field(() => String, { nullable: true })
  encryption?: string;

  @Field(() => Boolean, { nullable: true })
  contentBasedDeduplication?: boolean;
}

@InputType()
class RedrivePolicyInput {
  @Field()
  DeadLetterTargetArn: string;
  @Field()
  MaxReceiveCount: number;
}

@InputType()
export class QueueAttributesInput {
  @Field(() => Int, { nullable: true }) DelaySeconds?: number | string;
  @Field(() => Int, { nullable: true }) MaximumMessageSize?: number | string;
  @Field(() => Int, { nullable: true }) MessageRetentionPeriod?:
    | number
    | string;
  @Field(() => Int, { nullable: true }) ReceiveMessageWaitTimeSeconds?:
    | number
    | string;
  @Field(() => Int, { nullable: true }) VisibilityTimeout?: number | string;
  @Field({ nullable: true }) FifoQueue?: boolean;
  @Field({ nullable: true }) ContentBasedDeduplication?: boolean;
  @Field({ nullable: true }) DeduplicationScope?: string;
  @Field({ nullable: true }) FifoThroughputLimit?: string;
  @Field({ nullable: true }) KmsMasterKeyId?: string;
  @Field(() => Int, { nullable: true }) KmsDataKeyReusePeriodSeconds?:
    | number
    | string;
  @Field({ nullable: true }) RedrivePolicy?: RedrivePolicyInput;
  @Field({ nullable: true }) RedriveAllowPolicy?: string;
  @Field({ nullable: true }) SqsManagedSseEnabled?: boolean;
  @Field({ nullable: true }) Policy?: string;
}

@ObjectType()
export class QueueAttributes2 {
  @Field(() => String, { nullable: true })
  ApproximateNumberOfMessages?: string;

  @Field(() => String, { nullable: true })
  ApproximateNumberOfMessagesNotVisible?: string;

  @Field(() => String, { nullable: true })
  ApproximateNumberOfMessagesDelayed?: string;

  @Field(() => String, { nullable: true })
  CreatedTimestamp?: string;

  @Field(() => String, { nullable: true })
  DelaySeconds?: string;

  @Field(() => String, { nullable: true })
  LastModifiedTimestamp?: string;

  @Field(() => String, { nullable: true })
  MaximumMessageSize?: string;

  @Field(() => String, { nullable: true })
  MessageRetentionPeriod?: string;

  @Field(() => String, { nullable: true })
  QueueArn?: string;

  @Field(() => String, { nullable: true })
  ReceiveMessageWaitTimeSeconds?: string;

  @Field(() => String, { nullable: true })
  VisibilityTimeout?: string;

  @Field(() => String, { nullable: true })
  SqsManagedSseEnabled?: string;
}

@ObjectType()
export class SqsQueueWithAttributes {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name?: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  region: string;

  @Field(() => QueueAttributes2)
  attributes: QueueAttributes2;
}

@InputType()
export class TagInput {
  @Field() key: string;
  @Field() value: string;
}

@InputType()
export class CreateSqsQueueInput {
  @Field()
  Name: string;
  @Field(() => QueueAttributesInput, { nullable: true })
  attributes?: QueueAttributesInput;
  @Field(() => [TagInput], { nullable: true }) tags?: TagInput[];
}

@InputType()
export class UpdateSqsQueueInput {
  @Field(() => ID)
  id: string;
  @Field()
  name?: string;
  @Field(() => QueueAttributesInput, { nullable: true })
  attributes: QueueAttributesInput;
  @Field(() => [TagInput], { nullable: true }) tags?: TagInput[];
}
