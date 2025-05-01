import { Client, createClient, fetchExchange } from "@urql/core";

export const createUrqlClient = (region: string): Client => createClient({
    url: "http://localhost:3000/graphql",
    fetchOptions: () => {
        return {
            headers: {
                "x-region": region,
            },
        };
    }, exchanges: [fetchExchange],
});
