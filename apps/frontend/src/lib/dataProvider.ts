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
  UpdateResponse,
} from "@refinedev/core";
import { CreateResponse } from "@refinedev/core/src/contexts/data/types";
import { DocumentNode } from "graphql";
import flattenObjectKeys from "./utils/flattenObjectKeys";
import { GraphQlAction, GraphQLOperation, GraphQLQuery } from "./graphQlTypes";
import { GetListParams, GetListResponse } from '@refinedev/core/dist/contexts/data/types';

interface GraphQLQueryResult<T = object> {
  data: { [key: string]: T };
  error?: Error;
}

interface GraphQLMutationResult<T = object> {
  data: { [key: string]: T };
  error?: Error;
}

function findGraphQl(
  resource: string,
  action: GraphQlAction,
  meta?: MetaQuery,
): { query: DocumentNode; responseKey: string } {
  const map = GraphQLMap[resource] ? GraphQLMap[resource][action] : null;

  let query;
  let responseKey = meta?.responseKey;

  if (!responseKey) {
    if (!map) {
      throw new Error(
        `Response key for action ${action} not defined for resource: ${resource}`,
      );
    }

    responseKey = map.responseKey;
  }

  if (meta?.gqlQuery) {
    query = meta.gqlQuery;
  } else {
    if (!map) {
      throw new Error(
        `Operation not defined for resource: ${resource}, action: ${action}`,
      );
    }

    if (action === "create" || action === "update" || action === "delete") {
      query = (map as GraphQLOperation).mutation;
    } else {
      query = (map as GraphQLQuery).query;
    }
  }

  return {
    query,
    responseKey,
  };
}

async function executeGraphQLQuery<T>(
  client: Client,
  query: DocumentNode,
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
  mutation: DocumentNode,
  variables: Record<string, unknown>,
): Promise<GraphQLMutationResult<T>> {
  const request = createRequest(mutation, variables);
  const result = await pipe(client.executeMutation(request), toPromise);

  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }

  return result as GraphQLMutationResult<T>;
}

function validateResourceName(resource: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(resource)) {
    throw new Error("Invalid resource name");
  }
}

export const graphqlDataProvider = (client: Client): DataProvider => ({
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, meta }: GetListParams): Promise<GetListResponse<TData>> => {
    const region = meta?.region;

    validateResourceName(resource);

    const { query, responseKey } = findGraphQl(resource, "getList", meta);

    const result = await executeGraphQLQuery<TData[]>(client, query, { region });
    const data = result?.data[responseKey] || [];

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
    const region = meta?.region;

    validateResourceName(resource);

    const { query, responseKey } = findGraphQl(resource, "getOne", meta);

    const result = await executeGraphQLQuery<TData>(client, query, {
      region,
      id,
    });

    if (!result.data || !result.data[responseKey]) {
      throw new Error(
        `No data found for resource: ${resource}, response key: ${responseKey} with id: ${id}`,
      );
    }

    return {
      data: flattenObjectKeys(result.data[responseKey])  as TData,
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

    const { query, responseKey } = findGraphQl(resource, "create", meta);

    const result = await executeGraphQLMutation<TData>(client, query, {
      region: meta?.region,
      input: variables,
    });

    return {
      data: result.data?.[responseKey],
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

  update: async <
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
  }): Promise<UpdateResponse<TData>> => {
    console.log(resource);
    console.log(variables);
    console.log(meta);
    throw new Error("update not implemented");
  },

  getApiUrl: () => "",

  custom: async () => {
    throw new Error("custom not implemented");
  },
});
