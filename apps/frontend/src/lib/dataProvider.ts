import { DataProvider } from "@refinedev/core";
import { Client } from "@urql/core";

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

    // Add create/update/delete only if needed
    create: async () => {
        throw new Error("create not implemented");
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
