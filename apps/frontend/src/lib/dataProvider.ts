import { Client, createRequest } from "@urql/core";
import { GraphQLMap } from '../graphql/graphqlMap';
import { pipe, toPromise } from "wonka";

interface DataProviderResponse<T> {
    data: T;
    total?: number;
}

interface ResourceParams<TVariables = any> {
    resource: string;
    meta?: {
        fields?: string[]; region?: string;
    };
    variables?: TVariables;
    id?: string;
}

interface GraphQLDataProvider {
    getList: (params: ResourceParams) => Promise<DataProviderResponse<any[]>>;
    getOne: (params: ResourceParams) => Promise<DataProviderResponse<any>>;
    create: (params: ResourceParams) => Promise<DataProviderResponse<any>>;
    deleteOne: (params: ResourceParams) => Promise<{
        data: { id: string | undefined }
    }>;
    update: () => Promise<void>;
    getApiUrl: () => string;
    custom: () => Promise<void>;
}

interface GraphQLQueryResult<T = any> {
    data: { [key: string]: T };
    error?: Error;
}

interface GraphQLMutationResult<T = any> {
    data: { [key: string]: T };
    error?: Error;
}

async function executeGraphQLQuery<T>(client: Client, query: string, variables: Record<string, unknown>): Promise<GraphQLQueryResult<T>> {
    const result = await client.query(query, variables).toPromise();

    if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
    }

    return result as GraphQLQueryResult<T>;
}

async function executeGraphQLMutation<T>(client: Client, mutation: string, variables: Record<string, unknown>): Promise<GraphQLMutationResult<T>> {
    const request = createRequest(mutation, variables);
    const result = await pipe(client.executeMutation(request), toPromise);

    if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
    }

    return result as GraphQLMutationResult<T>;
}


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const defaultFields = ["id", "name", "region"];

export const graphqlDataProvider = (client: Client): GraphQLDataProvider => ({
    getList: async ({resource, meta}) => {
        const fields = meta?.fields ?? defaultFields;
        const region = meta?.region;

        const query = `
      query List${capitalize(resource)}($region: String!) {
        ${resource}(region: $region) {
          ${fields.join("\n")}
        }
      }
    `;

        const result = await executeGraphQLQuery<any[]>(client, query, {region});
        const data = result?.data[resource] || [];

        return {
            data, total: data.length,
        };


    },

    getOne: async ({resource, id, meta}) => {
        const fields = meta?.fields ?? defaultFields;
        const region = meta?.region;

        const query = `
      query Get${capitalize(resource)}($id: ID!) {
        ${resource}(id: $id) {
          ${fields.join("\n")}
        }
      }
    `;

        const result = await executeGraphQLQuery<any[]>(client, query, {region});

        const data = result.data?.[resource];

        return {
            data,
        };
    },

    create: async ({resource, variables, meta}) => {
        const map = GraphQLMap[resource]?.create;

        if (!map) {
            throw new Error(`Create operation not defined for resource: ${resource}`);
        }

        const result = await executeGraphQLMutation<any>(
            client,
            map.mutation,
            {
                region: meta?.region,
                input: variables,
            }
        );


        return {
            data: result.data?.[map.responseKey],
        };
    },

    deleteOne: async ({resource, id, meta}) => {
        const config = GraphQLMap[resource]?.delete;
        if (!config) {
            throw new Error(`Delete operation not defined for resource: ${resource}`);
        }

        await executeGraphQLMutation(client, config.mutation, {
            region: meta?.region,
            queueUrl: id,
        });


        return {
            data: {
                id,
            },
        };
    },

    update: async () => {
        throw new Error("update not implemented");
    },

    getApiUrl: () => "",

    custom: async () => {
        throw new Error("custom not implemented");
    },
});
