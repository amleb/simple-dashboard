import { Refine } from "@refinedev/core";
import { ErrorComponent, ThemedLayoutV2, useNotificationProvider, } from "@refinedev/antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import S3BucketsPage from "./pages/S3BucketsPage";
import SQSQueuesPage from "./pages/SQSQueuesPage";
import { RegionProvider } from "./contexts/RegionContext";
import React from 'react';
import { TopBar } from './components/TopBar';
import { DocumentTitleHandler, UnsavedChangesNotifier } from '@refinedev/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { graphqlDataProvider } from "./lib/dataProvider";
import { createUrqlClient } from "./lib/urqlClient";
import { CreateSqsQueue } from './pages/CreateSqsQueue';

const region = localStorage.getItem("region") || "us-east-1";
const client = createUrqlClient(region);

const App: React.FC = () => {
    return (<ThemeProvider>
            <RegionProvider>
                <BrowserRouter>
                    <Refine
                        dataProvider={graphqlDataProvider(client)}
                        resources={[{
                            name: "buckets", list: "/buckets", meta: {label: "S3 Buckets"},
                        }, {
                            name: "sqsQueues", list: "/sqs-queues", meta: {label: "SQS Queues"},
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
                                    path="sqs-queues"
                                    element={<SQSQueuesPage/>}
                                />
                                <Route path="/sqs/create" element={<CreateSqsQueue />} />
                                <Route path="*" element={<ErrorComponent/>}/>
                            </Routes>
                            <UnsavedChangesNotifier/>
                            <DocumentTitleHandler/>
                        </ThemedLayoutV2>
                    </Refine>
                </BrowserRouter>
            </RegionProvider>
        </ThemeProvider>);
};

export default App;
