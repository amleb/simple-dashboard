import { Refine } from "@refinedev/core";
import {
    ErrorComponent,
} from "@refinedev/antd";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import WelcomePage from "./pages/WelcomePage";
import S3BucketsPage from "./pages/S3BucketsPage";
import SQSQueuesPage from "./pages/SQSQueuesPage";
import { RegionProvider } from "./contexts/RegionContext";
import { CustomLayout } from "./components/CustomLayout";

import { client } from './lib/apollo';
import React from 'react';

const App: React.FC = () => {
    return (<ApolloProvider client={client}>
        <RegionProvider>
            <BrowserRouter>
                <Refine
                    resources={[{
                        name: "buckets", list: "/buckets", meta: {label: "S3 Buckets"},
                    }, {
                        name: "queues", list: "/queues", meta: {label: "SQS Queues"},
                    },]}
                >
                    <CustomLayout>
                        <Routes>
                            <Route
                                path="/"
                                element={<WelcomePage/>}
                            />
                            <Route
                                path="buckets"
                                element={<S3BucketsPage/>}
                            />
                            <Route
                                path="queues"
                                element={<SQSQueuesPage/>}
                            />
                            <Route path="*" element={<ErrorComponent/>}/>
                        </Routes>
                    </CustomLayout>
                </Refine>
            </BrowserRouter>
        </RegionProvider>
    </ApolloProvider>);
};

export default App;
