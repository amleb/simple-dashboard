import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo';

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
);
