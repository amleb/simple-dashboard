import { Client, createRequest } from "@urql/core";
import { GraphQLMap } from "../graphql/graphqlMap";
import { pipe, toPromise } from "wonka";
import {
  BaseKey,
  BaseRecord,
  DataProvider,
  DeleteOneResponse,
  GetOneResponse,
  MetaQuery,
  NestedField,
} from "@refinedev/core";
import { CreateResponse } from "@refinedev/core/src/contexts/data/types";

interface GraphQLQueryResult<T = any> {
  data: { [key: string]: T };
  error?: Error;
}

interface GraphQLMutationResult<T = any> {
  data: { [key: string]: T };
  error?: Error;
}

async function executeGraphQLQuery<T>(
  client: Client,
  query: string,
  variables: Record<string, unknown>,
): Promise<GraphQLQueryResult<T>> {
  const result = await client.query(query, variables).toPromise();

  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }

  return result as GraphQLQueryResult<T>;
}

async function executeGraphQLMutation<T>(
  client: Client,
  mutation: string,
  variables: Record<string, unknown>,
): Promise<GraphQLMutationResult<T>> {
  const request = createRequest(mutation, variables);
  const result = await pipe(client.executeMutation(request), toPromise);

  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }

  return result as GraphQLMutationResult<T>;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const defaultFields = ["id", "name", "region"];

function validateResourceName(resource: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(resource)) {
    throw new Error("Invalid resource name");
  }
}

function validateResourceFields(fields: string | object | NestedField[]) {
  if (
    !Array.isArray(fields) ||
    !fields.every((field) => typeof field === "string")
  ) {
    throw new Error("Invalid fields specification");
  }
}

export const graphqlDataProvider = (client: Client): DataProvider => ({
  getList: async ({ resource, meta }) => {
    const fields = meta?.fields ?? defaultFields;
    const region = meta?.region;

    validateResourceName(resource);
    validateResourceFields(fields);

    const query = `
      query List${capitalize(resource)}($region: String!) {
        ${resource}(region: $region) {
          ${fields.join("\n")}
        }
      }
    `;

    const result = await executeGraphQLQuery<any[]>(client, query, { region });
    const data = result?.data[resource] || [];

    return {
      data,
      total: data.length,
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
    meta,
  }: {
    resource: string;
    id: BaseKey;
    meta?: MetaQuery;
  }): Promise<GetOneResponse<TData>> => {
    const fields = meta?.fields ?? defaultFields;
    const region = meta?.region;

    validateResourceName(resource);

    const query = `
      query Get${capitalize(resource)}($id: ID!, $region: String) {
        ${resource}(id: $id) {
          ${fields.join("\n")}
        }
      }
    `;

    const result = await executeGraphQLQuery<TData>(client, query, {
      region,
      id,
    });

    if (!result.data || !result.data[resource]) {
      throw new Error(`No data found for resource: ${resource} with id: ${id}`);
    }

    return {
      data: result.data[resource] as TData,
    };
  },

  create: async <
    TData extends BaseRecord = BaseRecord,
    TVariables = NonNullable<unknown>,
  >({
    resource,
    variables,
    meta,
  }: {
    resource: string;
    variables: TVariables;
    meta?: MetaQuery;
  }): Promise<CreateResponse<TData>> => {
    validateResourceName(resource);
    const map = GraphQLMap[resource]?.create;

    if (!map) {
      throw new Error(`Create operation not defined for resource: ${resource}`);
    }

    const result = await executeGraphQLMutation<TData>(client, map.mutation, {
      region: meta?.region,
      input: variables,
    });

    return {
      data: result.data?.[map.responseKey],
    };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
    meta,
  }: {
    resource: string;
    id: BaseKey;
    meta?: MetaQuery;
  }): Promise<DeleteOneResponse<TData>> => {
    validateResourceName(resource);

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
      } as TData,
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
