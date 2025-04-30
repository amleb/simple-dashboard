import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import dataProvider, { GraphQLClient } from "@refinedev/graphql";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { SQSList } from './components/sqs';

const API_URL = "https://your-graphql-url/graphql";

const client = new GraphQLClient(API_URL);
const gqlDataProvider = dataProvider(client);

function App() {
  return (
      <div className="h-screen bg-base-200 p-4">
          <h1 className="text-2xl font-bold mb-4">AWS Dashboard</h1>
          <SQSList />
      </div>
  );
}

export default App;
