import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  Spin,
  Switch,
} from "antd";
import { useState } from "react";
import useCreateResource from "../hooks/useCreateResource";
import {
  timeUnitsUpToHours,
  timeUnitsUpToDays,
  convertTimeUnitFieldsToSeconds,
} from "../lib/utils/convertToSeconds";
import { TimeWithUnitInput } from "../components/form/TimeWithUnitInput";
import validateRange from "../lib/utils/fieldRangeValidator";

export const CreateSqsQueue = () => {
  const [isFifo, setIsFifo] = useState(false);

  const { formProps, submitProps } = useCreateResource({
    resourceName: "SQS Queue",
    redirectTo: "/sqs",
    apiResourceName: "sqsQueues",
    beforeSave: (data) => {
      data.MaximumMessageSize = data.MaximumMessageSize * 1024;
      return convertTimeUnitFieldsToSeconds(data);
    },
  });

  const onFifoChange = (e: boolean) => {
    setIsFifo(e);
    const currentName = formProps.form.getFieldValue("name");
    if (e && !currentName.endsWith(".fifo")) {
      formProps.form.setFieldsValue({ queueName: `${currentName}.fifo` });
    } else if (!e && currentName.endsWith(".fifo")) {
      formProps.form.setFieldsValue({
        queueName: currentName.replace(/\.fifo$/, ""),
      });
    }
  };

  const getPlaceholder = () => {
    return isFifo ? "QueueName.fifo" : "QueueName";
  };

  const layout = {};

  return (
    <Form
      {...layout}
      {...formProps}
      name="control-hooks"
      labelWrap
      style={{ maxWidth: 1200 }}
      initialValues={{
        FifoQueue: false,
        MaximumMessageSize: 256,
        ReceiveMessageWaitTimeSeconds: 0,
        ContentBasedDeduplication: false,
        DeduplicationScope: "messageGroup",
        FifoThroughputLimit: "perQueue",
      }}
    >
      <Spin spinning={submitProps.loading}>
        <h2 className="text-xl font-bold">Create SQS Queue</h2>

        <Card title="Details" size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Queue Type"
            valuePropName="checked"
            name="FifoQueue"
          >
            <Switch
              checkedChildren="FIFO"
              unCheckedChildren="Standard"
              onChange={onFifoChange}
            />
          </Form.Item>

          <Form.Item
            label="Queue name"
            name="name"
            rules={[
              { required: true, message: "Please input queue name!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("FifoQueue") && !value?.endsWith(".fifo")) {
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
            fieldName="DelaySeconds"
            label="Delivery Delay"
            units={timeUnitsUpToHours}
            min={0}
            max={900}
            rules={[{ required: true, message: "Please specify a delay" }]}
            initialValue={30}
            errorMessage="Should be between 0 seconds and 15 minutes."
          />

          <Form.Item
            name="MaximumMessageSize"
            label="Max Message Size (kb)"
            rules={[
              { required: true, message: "Please specify a delay" },
              validateRange(1, 256, "kb"),
            ]}
          >
            <InputNumber />
          </Form.Item>

          <TimeWithUnitInput
            fieldName="MessageRetentionPeriod"
            label="Message Retention Period"
            units={timeUnitsUpToDays}
            min={60}
            max={1209600}
            initialValue={4}
            initialUnit="days"
            errorMessage="Should be between 1 minute and 14 days."
          />

          <TimeWithUnitInput
            fieldName="VisibilityTimeout"
            label="Visibility Timeout"
            units={timeUnitsUpToHours}
            min={0}
            max={43200}
            initialValue={30}
            errorMessage="Should be between 0 seconds and 12 hours."
          />

          <Form.Item
            name="ReceiveMessageWaitTimeSeconds"
            label="Receive Message Wait Time (seconds)"
            rules={[validateRange(0, 20, "seconds")]}
          >
            <InputNumber />
          </Form.Item>
        </Card>

        {isFifo && (
          <Card title="Advanced" size="small">
            <Form.Item
              name="ContentBasedDeduplication"
              label="Content-based Deduplication (FIFO only)"
              valuePropName="checked"
            >
              <Switch disabled={!isFifo} />
            </Form.Item>

            <Form.Item
              name="DeduplicationScope"
              label="Deduplication Scope"
              tooltip="Scope for deduplication within the FIFO queue"
            >
              <Radio.Group disabled={!isFifo}>
                <Radio value="MessageGroup">Message Group</Radio>
                <Radio value="Queue">Queue</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="FifoThroughputLimit"
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
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" {...submitProps}>
            Create
          </Button>
        </Form.Item>
      </Spin>
    </Form>
  );
};
