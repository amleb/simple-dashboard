import React from "react";
import { List, useTable } from "@refinedev/antd";
import { Button, notification, Popconfirm, Space, Table } from "antd";
import { useRegion } from "../contexts/RegionContext";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { useDelete } from "@refinedev/core";
import { ColumnsType } from "antd/es/table";

type SqsQueue = {
  id: string;
  name: string;
  region: string;
};

const SQSQueuesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: deleteQueue, isLoading: isDeleting } = useDelete();
  const { region } = useRegion();

  const columns: ColumnsType<SqsQueue> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (value: string) => value && new Date(value).toLocaleString(),
    },
    {
      title: "Messages Available",
      dataIndex: "messagesAvailable",
    },
    {
      title: "Messages In Flight",
      dataIndex: "messagesInFlight",
    },
    {
      title: "Encryption",
      dataIndex: "encryption",
    },
    {
      title: "Content-Based Deduplication",
      dataIndex: "contentBasedDeduplication",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: string, record: SqsQueue) => (
        <Popconfirm
          title="Are you sure to delete this queue?"
          onConfirm={() =>
            deleteQueue(
              {
                resource: "sqsQueues",
                id: record.id,
                mutationMode: "pessimistic",
                meta: {
                  region,
                },
              },
              {
                onSuccess: () => {
                  notification.success({
                    message: "Queue deleted successfully",
                  });
                },
                onError: () => {
                  notification.error({ message: "Failed to delete queue" });
                },
              },
            )
          }
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} loading={isDeleting} />
        </Popconfirm>
      ),
    },
  ];

  const { tableProps } = useTable<SqsQueue>({
    resource: "sqsQueues",
    meta: {
      region,
      fields: [
        "id",
        "name",
        "region",
        "type",
        "createdAt",
        "messagesAvailable",
        "messagesInFlight",
        "encryption",
        "contentBasedDeduplication",
      ],
    },
  });

  return (
    <List title="SQS Queues">
      <Space>
        <Button type="primary" onClick={() => navigate("/sqs/create")}>
          New Queue
        </Button>
      </Space>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
};

export default SQSQueuesPage;
