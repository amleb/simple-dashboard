import { DocumentNode } from "graphql";

export type GraphQlQueryAction = "getOne" | "getList" | "query";
export type GraphQlMutateAction = "create" | "update" | "delete";
export type GraphQlAction = GraphQlQueryAction | GraphQlMutateAction;

export type GraphQLQuery = {
  query: DocumentNode;
  responseKey?: string;
};

export type GraphQLOperation = {
  mutation: DocumentNode;
  responseKey?: string;
};

export type GraphQLResourceOperations = {
  [action in GraphQlQueryAction]?: GraphQLQuery;
} & {
  [action in GraphQlMutateAction]?: GraphQLOperation;
};

export type GraphQLMapType = {
  [resource: string]: GraphQLResourceOperations;
};
