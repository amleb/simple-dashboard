import { DataProvider } from "@refinedev/core";
import { Client, createRequest } from "@urql/core";
import { GraphQLMap } from '../graphql/graphqlMap';
import { pipe, toPromise } from "wonka";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const defaultFields = ["id", "name", "region"];

export const graphqlDataProvider = (client: Client): DataProvider => ({
    getList: async ({ resource, meta }) => {
        const fields = meta?.fields ?? defaultFields;
        const region = meta?.region;

        const query = `
      query List${capitalize(resource)}($region: String!) {
        ${resource}(region: $region) {
          ${fields.join("\n")}
        }
      }
    `;

        const result = await client
            .query(query, { region })
            .toPromise();

        if (result.error) {
            throw result.error;
        }

        const data = result.data?.[resource] || [];

        return {
            data,
            total: data.length,
        };
    },

    getOne: async ({ resource, id, meta }) => {
        const fields = meta?.fields ?? defaultFields;

        const query = `
      query Get${capitalize(resource)}($id: ID!) {
        ${resource}(id: $id) {
          ${fields.join("\n")}
        }
      }
    `;

        const result = await client
            .query(query, { id })
            .toPromise();

        if (result.error) {
            throw result.error;
        }

        const data = result.data?.[resource];

        return {
            data,
        };
    },

    create: async ({ resource, variables, meta }) => {
        const map = GraphQLMap[resource]?.create;

        if (!map) {
            throw new Error(`Create operation not defined for resource: ${resource}`);
        }

        const region = meta?.region;
        const request = createRequest(map.mutation, {
            region,
            input: variables,
        });

        const result = await pipe(
            client.executeMutation(request),
            toPromise,
        );

        if (result.error) {
            throw result.error;
        }

        return {
            data: result.data?.[map.responseKey],
        };
    },

    update: async () => {
        throw new Error("update not implemented");
    },

    deleteOne: async () => {
        throw new Error("deleteOne not implemented");
    },

    getApiUrl: () => "",
    custom: async () => {
        throw new Error("custom not implemented");
    },
});
