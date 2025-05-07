import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useForm } from "@refinedev/antd";
import { useRef } from "react";
import { BaseRecord, useCreate, useWarnAboutChange } from "@refinedev/core";
import { FieldValues } from "react-hook-form";
import { useRegion } from "../contexts/RegionContext";
import { omit } from "lodash";

interface UseCreateResourceParams {
  apiResourceName: string; // The name of the GraphQL API resource (e.g., "sqsQueues", "s3Buckets")
  redirectTo: string;
  resourceName?: string; // The name of the resource (e.g., "SQS Queue", "S3 Bucket")
  beforeSave?: (data: FieldValues) => FieldValues;
}

interface CreateResponseData extends BaseRecord {
  id: string;
  name: string;
  region: string;
}

const useCreateResource = <T extends CreateResponseData>({
  resourceName,
  redirectTo,
  apiResourceName,
  beforeSave,
}: UseCreateResourceParams) => {
  const [loading, setLoading] = useState(false);
  const [creatingResource, setCreatingResource] = useState(false);
  const { form } = useForm();
  const navigate = useNavigate();
  const [, setHasUnsavedChanges] = useState(false); // To track unsaved changes
  const formRef = useRef(form);
  const { region } = useRegion();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const { mutate } = useCreate<T>({
    resource: apiResourceName,
    mutationOptions: {
      retry: 1,
      onSuccess: (data) => {
        setIsFormDirty(false);

        notification.success({
          message: "",
          description: `${resourceName || "Resource"} "${data.data.name}" was created successfully.`,
        });

        navigate(redirectTo);
      },
      onError: (error) => {
        notification.error({
          message: `Failed to create ${(resourceName || "Resource").toLowerCase()}`,
          description: error.message,
        });

        setIsFormDirty(false);
        setCreatingResource(false);
        setLoading(false);
      },
    },
  });

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

    if (typeof beforeSave === "function") {
      data = beforeSave(data);
    }

    await fakeApiDelay(0);

    const itemName = data.name;

    mutate({
      values: {
        name: itemName,
        attributes: omit(data, ["name"]),
      },
      meta: { region },
    });
  };

  return {
    formProps: {
      form,
      onValuesChange,
      onFinish,
      ref: formRef,
    },
    submitProps: {
      loading: creatingResource,
      disabled: loading,
    },
  };
};

export default useCreateResource;
