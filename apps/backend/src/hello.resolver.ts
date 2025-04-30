import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class Hello {
  @Field()
  message: string;

  @Field()
  test: string;
}

@Resolver(() => Hello)
export class HelloResolver {
  @Query(() => Hello)
  hello(): Hello {
    return { message: 'Hello from GraphQL!', test: 'foo' };
  }
}
