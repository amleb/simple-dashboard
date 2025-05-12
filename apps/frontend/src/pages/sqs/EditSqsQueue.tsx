import { Card, Form, Input, InputNumber, Radio, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import {
  timeUnitsUpToHours,
  timeUnitsUpToDays,
  convertTimeUnitFieldsToSeconds,
} from "../../lib/utils/convertToSeconds";
import { TimeWithUnitInput } from "../../components/form/TimeWithUnitInput";
import validateRange from "../../lib/utils/fieldRangeValidator";
import { Edit, useForm } from "@refinedev/antd";
import { useRegion } from "../../contexts/RegionContext";
import { FieldValues } from "react-hook-form";
import expandObjectKeys from "../../lib/utils/expandObjectKeys";
import { useParams } from "react-router";

const EditSqsQueue = () => {
  const { region } = useRegion();
  const { id } = useParams();
  const { form, formProps, saveButtonProps, onFinish, queryResult } = useForm({
    id,
    action: "edit",
    warnWhenUnsavedChanges: true,
    resource: "sqsQueues",
    queryOptions: { retry: 1 },
    meta: {
      region,
    },
  });
  const [loading] = useState(false);
  const [isFifo] = useState(false);

  const handleOnFinish = async (values: FieldValues) => {
    values.id = id;
    values["attributes.MaximumMessageSize"] =
      values["attributes.MaximumMessageSize"] * 1024;
    await onFinish(expandObjectKeys(convertTimeUnitFieldsToSeconds(values)));
  };

  useEffect(() => {
    if (queryResult?.data?.data) {
      const raw = queryResult.data.data;
      form.setFieldsValue({
        ...raw,
        "attributes.MaximumMessageSize":
          raw["attributes.MaximumMessageSize"] / 1024,
      });
    }
  }, [form, queryResult?.data]);

  const layout = {};

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...layout}
        {...formProps}
        form={form}
        onFinish={handleOnFinish}
        name="control-hooks"
        labelWrap
        style={{ maxWidth: 1200 }}
      >
        <Spin spinning={loading}>
          <h2 className="text-xl font-bold">Create SQS Queue</h2>

          <Card title="Details" size="small" style={{ marginBottom: 16 }}>
            <Form.Item label="Queue Type" name="type">
              <Input disabled={true} />
            </Form.Item>

            <Form.Item label="Queue name" name="name">
              <Input disabled={true} />
            </Form.Item>
          </Card>

          <Card title="Configuration" size="small" style={{ marginBottom: 16 }}>
            <TimeWithUnitInput
              fieldName="attributes.DelaySeconds"
              label="Delivery Delay"
              units={timeUnitsUpToHours}
              min={0}
              max={900}
              rules={[{ required: true, message: "Please specify a delay" }]}
              errorMessage="Should be between 0 seconds and 15 minutes."
            />

            <Form.Item
              name="attributes.MaximumMessageSize"
              label="Max Message Size (kb)"
              rules={[
                { required: true, message: "Please specify a delay" },
                validateRange(1, 256, "kb"),
              ]}
            >
              <InputNumber />
            </Form.Item>

            <TimeWithUnitInput
              fieldName="attributes.MessageRetentionPeriod"
              label="Message Retention Period"
              units={timeUnitsUpToDays}
              min={60}
              max={1209600}
              errorMessage="Should be between 1 minute and 14 days."
            />

            <TimeWithUnitInput
              fieldName="attributes.VisibilityTimeout"
              label="Visibility Timeout"
              units={timeUnitsUpToHours}
              min={0}
              max={43200}
              errorMessage="Should be between 0 seconds and 12 hours."
            />

            <Form.Item
              name="attributes.ReceiveMessageWaitTimeSeconds"
              label="Receive Message Wait Time (seconds)"
              rules={[validateRange(0, 20, "seconds")]}
            >
              <InputNumber />
            </Form.Item>
          </Card>

          {isFifo && (
            <Card title="Advanced" size="small">
              <Form.Item
                name="attributes.ContentBasedDeduplication"
                label="Content-based Deduplication (FIFO only)"
                valuePropName="checked"
              >
                <Switch disabled={!isFifo} />
              </Form.Item>

              <Form.Item
                name="attributes.DeduplicationScope"
                label="Deduplication Scope"
                tooltip="Scope for deduplication within the FIFO queue"
              >
                <Radio.Group disabled={!isFifo}>
                  <Radio value="MessageGroup">Message Group</Radio>
                  <Radio value="Queue">Queue</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="attributes.FifoThroughputLimit"
                label="FIFO Throughput Limit"
                tooltip="Enable high throughput mode for FIFO queue"
              >
                <Radio.Group disabled={!isFifo}>
                  <Radio value="PerQueue">Per Queue</Radio>
                  <Radio value="PerMessageGroupId">Per Message Group ID</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>
          )}
        </Spin>
      </Form>
    </Edit>
  );
};

export default EditSqsQueue;
