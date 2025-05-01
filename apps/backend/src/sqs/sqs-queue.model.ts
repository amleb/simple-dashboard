import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

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
export class SqsQueuesWhereInput {
  @Field({ nullable: true })
  region?: string;
}

@InputType()
export class CreateSqsQueueInput {
  @Field()
  name: string;
}
