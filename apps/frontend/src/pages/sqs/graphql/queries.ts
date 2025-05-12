import gql from "graphql-tag";
import { GraphQLResourceOperations } from "../../../lib/graphQlTypes";

const sqsResourceOperations: GraphQLResourceOperations = {
  create: {
    mutation: gql`
      mutation CreateSqsQueue($region: String!, $input: CreateSqsQueueInput!) {
        createSqsQueue(region: $region, input: $input) {
          id
          name
          region
        }
      }
    `,
    responseKey: "createSqsQueue",
  },
  delete: {
    mutation: gql`
      mutation DeleteSqsQueue($region: String!, $queueUrl: String!) {
        deleteSqsQueue(region: $region, queueUrl: $queueUrl)
      }
    `,
    responseKey: "deleteSqsQueue",
  },
  getOne: {
    query: gql`
      query GetSqsQueue($region: String!, $id: ID!) {
        getSqsQueue(region: $region, id: $id) {
          id
          name
          type
          region
          attributes {
            DelaySeconds
            MaximumMessageSize
            MessageRetentionPeriod
            ReceiveMessageWaitTimeSeconds
            VisibilityTimeout
            SqsManagedSseEnabled
          }
        }
      }
    `,
    responseKey: "getSqsQueue",
  },
  getList: {
    query: gql`
      query ListSqsQueues($region: String!) {
        sqsQueues(region: $region) {
          id
          name
          region
          type
          createdAt
          messagesAvailable
          messagesInFlight
          encryption
          contentBasedDeduplication
        }
      }
    `,
    responseKey: "sqsQueues",
  },
  update: {
    mutation: gql`
    mutation UpdateSqsQueue($region: String!, $input: UpdateSqsQueueInput!) {
      updateSqsQueue(region: $region, input: $input) {
        id
      }
    }
  `,
    responseKey: "updateSqsQueue"
  }
};

export default sqsResourceOperations;
