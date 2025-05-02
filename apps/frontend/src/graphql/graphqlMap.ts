interface GraphQLOperation {
  mutation: string;
  responseKey: string;
}

interface ResourceOperations {
  create?: GraphQLOperation;
  delete?: GraphQLOperation;
}

type GraphQLMapType = {
  [resource: string]: ResourceOperations;
};

export const GraphQLMap: GraphQLMapType = {
  sqsQueues: {
    create: {
      mutation: `
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
      mutation: `
        mutation DeleteSqsQueue($region: String!, $queueUrl: String!) {
          deleteSqsQueue(region: $region, queueUrl: $queueUrl)
        }
      `,
      responseKey: "deleteSqsQueue",
    },
  },
  s3Buckets: {
    create: {
      mutation: `
        mutation CreateS3Bucket($region: String!, $input: CreateS3BucketInput!) {
          createS3Bucket(region: $region, input: $input) {
            id
            name
            region
          }
        }
      `,
      responseKey: "createS3Bucket",
    },
  },
};
