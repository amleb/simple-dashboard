import { Refine } from "@refinedev/core";
import { ErrorComponent, ThemedLayoutV2, useNotificationProvider, } from "@refinedev/antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import WelcomePage from "./pages/WelcomePage";
import S3BucketsPage from "./pages/S3BucketsPage";
import SQSQueuesPage from "./pages/SQSQueuesPage";
import { RegionProvider } from "./contexts/RegionContext";
import { client } from './lib/apollo';
import React from 'react';
import { TopBar } from './components/TopBar';
import { DocumentTitleHandler, UnsavedChangesNotifier } from '@refinedev/react-router';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
    return (<ApolloProvider client={client}>
        <ThemeProvider>
            <RegionProvider>
                <BrowserRouter>
                    <Refine
                        resources={[{
                            name: "buckets", list: "/buckets", meta: {label: "S3 Buckets"},
                        }, {
                            name: "queues", list: "/queues", meta: {label: "SQS Queues"},
                        },]}
                        notificationProvider={useNotificationProvider}
                        options={{
                            syncWithLocation: true, warnWhenUnsavedChanges: true,
                        }}
                    >
                        <ThemedLayoutV2
                            Header={() => <TopBar/>}
                        >
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
                            <UnsavedChangesNotifier/>
                            <DocumentTitleHandler/>
                        </ThemedLayoutV2>
                    </Refine>
                </BrowserRouter>
            </RegionProvider>
        </ThemeProvider>
    </ApolloProvider>);
};

export default App;
