import { gql } from '@apollo/client';

export const LIST_SQS = gql`
  query ListSQS {
    sqsQueues {
      url
    }
  }
`;
