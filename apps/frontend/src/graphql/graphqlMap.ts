type GraphQLMapType = {
    [key: string]: {
        create: {
            mutation: string;
            responseKey: string;
        };
    };
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
