import { GraphQLMapType } from '../lib/graphQlTypes';
import sqsResourceOperations from '../pages/sqs/graphql/queries';

export const GraphQLMap: GraphQLMapType = {
  sqsQueues: sqsResourceOperations,
};
