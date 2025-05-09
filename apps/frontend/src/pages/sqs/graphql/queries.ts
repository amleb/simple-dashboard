import gql from "graphql-tag";
import { GraphQLResourceOperations } from "../../../lib/graphQlTypes";


// export const UPDATE_SQS_QUEUE = {
//   mutation: `
//     mutation UpdateSqsQueue($region: String!, $queueUrl: String!, $input: UpdateSqsQueueInput!) {
//       updateSqsQueue(region: $region, queueUrl: $queueUrl, input: $input) {
//         id
//         name
//         region
//         fifoQueue
//         visibilityTimeout
//         messageRetentionPeriod
//         delaySeconds
//         maximumMessageSize
//         receiveMessageWaitTimeSeconds
//         contentBasedDeduplication
//         deduplicationScope
//         fifoThroughputLimit
//         kmsMasterKeyId
//         redrivePolicy
//         redriveAllowPolicy
//         sqsManagedSseEnabled
//         policy
//       }
//     }
//   `,
// };


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
            ApproximateNumberOfMessages
            ApproximateNumberOfMessagesNotVisible
            ApproximateNumberOfMessagesDelayed
            CreatedTimestamp
            DelaySeconds
            LastModifiedTimestamp
            MaximumMessageSize
            MessageRetentionPeriod
            QueueArn
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
};

export default sqsResourceOperations;
