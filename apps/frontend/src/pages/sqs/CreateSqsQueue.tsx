import { Card, Form, Input, InputNumber, Radio, Spin, Switch } from "antd";
import { useState } from "react";
import {
  timeUnitsUpToHours,
  timeUnitsUpToDays,
  convertTimeUnitFieldsToSeconds,
} from "../../lib/utils/convertToSeconds";
import { TimeWithUnitInput } from "../../components/form/TimeWithUnitInput";
import validateRange from "../../lib/utils/fieldRangeValidator";
import { Create, useForm } from "@refinedev/antd";
import { useRegion } from "../../contexts/RegionContext";
import { FieldValues } from "react-hook-form";
import expandObjectKeys from "../../lib/utils/expandObjectKeys";

const CreateSqsQueue = () => {
  const { region } = useRegion();
  const { form, formProps, saveButtonProps, onFinish } = useForm({
    warnWhenUnsavedChanges: true,
    resource: "sqsQueues",
    meta: {
      region,
    },
  });
  const [loading] = useState(false);
  const [isFifo, setIsFifo] = useState(false);

  const handleOnFinish = async (values: FieldValues) => {
    values["attributes.MaximumMessageSize"] =
      values["attributes.MaximumMessageSize"] * 1024;
    await onFinish(expandObjectKeys(convertTimeUnitFieldsToSeconds(values)));
  };

  const onFifoChange = (e: boolean) => {
    setIsFifo(e);
    const currentName = form.getFieldValue("Name");
    if (currentName) {
      if (e && !currentName.endsWith(".fifo")) {
        form.setFieldsValue({ queueName: `${currentName}.fifo` });
      } else if (!e && currentName.endsWith(".fifo")) {
        form.setFieldsValue({
          queueName: currentName.replace(/\.fifo$/, ""),
        });
      }
    }
  };

  const getPlaceholder = () => {
    return isFifo ? "QueueName.fifo" : "QueueName";
  };

  const layout = {};

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...layout}
        {...formProps}
        form={form}
        onFinish={handleOnFinish}
        name="control-hooks"
        labelWrap
        style={{ maxWidth: 1200 }}
        initialValues={{
          "attributes.FifoQueue": false,
          "attributes.MaximumMessageSize": 256,
          "attributes.ReceiveMessageWaitTimeSeconds": 0,
          "attributes.ContentBasedDeduplication": false,
          "attributes.DeduplicationScope": "messageGroup",
          "attributes.FifoThroughputLimit": "perQueue",
        }}
      >
        <Spin spinning={loading}>
          <h2 className="text-xl font-bold">Create SQS Queue</h2>

          <Card title="Details" size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Queue Type"
              valuePropName="checked"
              name="attributes.FifoQueue"
            >
              <Switch
                checkedChildren="FIFO"
                unCheckedChildren="Standard"
                onChange={onFifoChange}
              />
            </Form.Item>

            <Form.Item
              label="Queue name"
              name="Name"
              rules={[
                { required: true, message: "Please input queue name!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      getFieldValue("attributes.FifoQueue") &&
                      !value?.endsWith(".fifo")
                    ) {
                      return Promise.reject(
                        new Error("FIFO queue names must end with .fifo"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder={getPlaceholder()} />
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
              initialValue={30}
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
              initialValue={4}
              initialUnit="days"
              errorMessage="Should be between 1 minute and 14 days."
            />

            <TimeWithUnitInput
              fieldName="attributes.VisibilityTimeout"
              label="Visibility Timeout"
              units={timeUnitsUpToHours}
              min={0}
              max={43200}
              initialValue={30}
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
    </Create>
  );
};

export default CreateSqsQueue;
