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

export const CreateSqsQueue = () => {
  const [selectedType] = useState("standard");
  const [isFifo, setIsFifo] = useState(false);

  const { form, submit } = useCreateResource({
    resourceName: "SQS Queue",
    redirectTo: "/sqs-queues",
    apiResourceName: "sqsQueues",
  });

  const onFifoChange = (e: boolean) => {
    setIsFifo(e);
    const currentName = form.form.getFieldValue("queueName");
    if (e && !currentName.endsWith(".fifo")) {
      form.form.setFieldsValue({ queueName: `${currentName}.fifo` });
    } else if (!e && currentName.endsWith(".fifo")) {
      form.form.setFieldsValue({
        queueName: currentName.replace(/\.fifo$/, ""),
      });
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case "standard":
        return "QueueName";
      case "fifo":
        return "QueueName.fifo";
    }
  };

  const layout = {};

  return (
    <Form
      {...layout}
      {...form}
      name="control-hooks"
      labelWrap
      style={{ maxWidth: 1200 }}
    >
      <Spin spinning={submit.loading}>
        <h2 className="text-xl font-bold">Create SQS Queue</h2>

        <Card title="Details" size="small" style={{ marginBottom: 16 }}>
          <Form.Item label="Queue Type" valuePropName="checked">
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
                  const selectedType = getFieldValue("type");
                  if (selectedType === "fifo" && !value?.endsWith(".fifo")) {
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
          <Form.Item name="delaySeconds" label="Delivery Delay (seconds)">
            <InputNumber min={0} max={900} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="maximumMessageSize" label="Max Message Size (bytes)">
            <InputNumber min={1024} max={262144} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="messageRetentionPeriod"
            label="Message Retention Period (seconds)"
          >
            <InputNumber min={60} max={1209600} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="visibilityTimeout"
            label="Visibility Timeout (seconds)"
          >
            <InputNumber min={0} max={43200} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="receiveMessageWaitTimeSeconds"
            label="Receive Message Wait Time (seconds)"
          >
            <InputNumber min={0} max={20} style={{ width: "100%" }} />
          </Form.Item>
        </Card>

        <Card title="Advanced" size="small">
          <Form.Item
            name="contentBasedDeduplication"
            label="Content-based Deduplication (FIFO only)"
            valuePropName="checked"
          >
            <Switch disabled={!isFifo} />
          </Form.Item>

          <Form.Item
            name="deduplicationScope"
            label="Deduplication Scope"
            tooltip="Scope for deduplication within the FIFO queue"
          >
            <Radio.Group disabled={!isFifo}>
              <Radio value="messageGroup">Message Group</Radio>
              <Radio value="queue">Queue</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="fifoThroughputLimit"
            label="FIFO Throughput Limit"
            tooltip="Enable high throughput mode for FIFO queue"
          >
            <Radio.Group disabled={!isFifo}>
              <Radio value="perQueue">Per Queue</Radio>
              <Radio value="perMessageGroupId">Per Message Group ID</Radio>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" {...submit}>
            Create
          </Button>
        </Form.Item>
      </Spin>
    </Form>
  );
};
