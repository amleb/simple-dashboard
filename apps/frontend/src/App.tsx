import { Refine } from "@refinedev/core";
import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import S3BucketsPage from "./pages/S3BucketsPage";
import { CreateSqsQueue, ListSqsQueues, EditSqsQueue } from "./pages/sqs/pages";
import { RegionProvider } from "./contexts/RegionContext";
import React from "react";
import { TopBar } from "./components/TopBar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { graphqlDataProvider } from "./lib/dataProvider";
import { createUrqlClient } from "./lib/urqlClient";

const client = createUrqlClient(localStorage.getItem("region") || "us-east-1");

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RegionProvider>
        <BrowserRouter>
          <Refine
            routerProvider={routerProvider}
            dataProvider={graphqlDataProvider(client)}
            resources={[
              {
                name: "s3buckets",
                list: "/s3",
                meta: { label: "S3 Buckets" },
              },
              {
                name: "sqsQueues",
                list: "/sqs",
                meta: { label: "SQS Queues" },
              },
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <ThemedLayoutV2 Header={() => <TopBar />}>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/s3" element={<S3BucketsPage />} />
                <Route path="/sqs" element={<ListSqsQueues />} />
                <Route path="/sqs/create" element={<CreateSqsQueue />} />
                <Route path="/sqs/edit/:id" element={<EditSqsQueue />} />,
                <Route path="*" element={<ErrorComponent />} />
              </Routes>
            </ThemedLayoutV2>
            <DocumentTitleHandler />
            <UnsavedChangesNotifier />
          </Refine>
        </BrowserRouter>
      </RegionProvider>
    </ThemeProvider>
  );
};

export default App;
