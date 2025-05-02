import React from "react";
import { List, useTable } from "@refinedev/antd";
import { Button, Popconfirm, Space, Table } from "antd";
import { useRegion } from '../contexts/RegionContext';
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';
import { useDelete } from '@refinedev/core';

type SqsQueue = {
    id: string;
    name: string;
    region: string;
};

const SQSQueuesPage: React.FC = () => {
    const navigate = useNavigate();
    const {region, } = useRegion();
    const { tableProps } = useTable<SqsQueue>({
        resource: "sqsQueues",
        meta: {
            region
        }
    });

    const { mutate: deleteOne } = useDelete();

    const handleDelete = (id: string) => {
        deleteOne({
            resource: "sqsQueues",
            id,
            meta: { region }
        });
    };

    return (
        <List title="SQS Queues">
            <Space>
                <Button
                    type="primary"
                    onClick={() => navigate("/sqs/create")}
                >
                    New Queue
                </Button>
            </Space>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="Queue Name" />
                <Table.Column dataIndex="name" title="Queue URL" />
                <Table.Column
                    title="Actions"
                    render={(_, record) => (
                        <Popconfirm
                            title="Are you sure to delete this queue?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                            >
                            </Button>
                        </Popconfirm>
                    )}
                />
            </Table>
        </List>
    );
};

export default SQSQueuesPage;
