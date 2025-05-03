import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useForm } from "@refinedev/antd";
import { useRef } from "react";
import { useWarnAboutChange } from "@refinedev/core";
import { FieldValues } from "react-hook-form";
import { graphqlDataProvider } from "../lib/dataProvider";
import { useRegion } from "../contexts/RegionContext";
import { createUrqlClient } from "../lib/urqlClient";

interface UseCreateResourceParams {
  apiResourceName: string; // The name of the GraphQL API resource (e.g., "sqsQueues", "s3Buckets")
  redirectTo: string;
  resourceName?: string; // The name of the resource (e.g., "SQS Queue", "S3 Bucket")
}

const useCreateResource = ({
  resourceName,
  redirectTo,
  apiResourceName,
}: UseCreateResourceParams) => {
  const [loading, setLoading] = useState(false);
  const [creatingResource, setCreatingResource] = useState(false);
  const { form } = useForm();
  const navigate = useNavigate();
  const [, setHasUnsavedChanges] = useState(false); // To track unsaved changes
  const formRef = useRef(form);
  const { region } = useRegion();
  const client = createUrqlClient(region);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useWarnAboutChange();

  useEffect(() => {
    window.onbeforeunload = isFormDirty ? () => true : null;
    return () => {
      window.onbeforeunload = null;
    };
  }, [isFormDirty]);

  const fakeApiDelay = async (delay = 4000) => {
    return new Promise((res) => setTimeout(res, delay));
  };

  const onValuesChange = () => {
    setHasUnsavedChanges(true);
  };

  const onFinish = async (data: FieldValues) => {
    setLoading(true);
    setCreatingResource(true);

    await fakeApiDelay(0);

    try {
      const provider = graphqlDataProvider(client);
      await provider.create({
        resource: apiResourceName,
        variables: data,
        meta: { region },
      });

      setIsFormDirty(false);

      notification.success({
        message: "",
        description: `${resourceName || "Resource"} "${data.name}" was created successfully.`,
      });

      navigate(redirectTo);
    } catch (err: unknown) {
      const error = err as Error;
      notification.error({
        message: `Failed to create ${(resourceName || "Resource").toLowerCase()}`,
        description: error.message,
      });
    } finally {
      setCreatingResource(false);
      setLoading(false);
    }
  };

  return {
    form: {
      form,
      onValuesChange,
      onFinish,
      ref: formRef,
    },
    submit: {
      loading: creatingResource,
      disabled: loading,
    },
  };
};

export default useCreateResource;
