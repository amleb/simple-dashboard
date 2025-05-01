import React from "react";
import { useTable } from "@refinedev/antd";
import { List } from "@refinedev/antd";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useRegion } from '../contexts/RegionContext';
import { useNavigate } from "react-router-dom";

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

    const columns: TableProps<SqsQueue>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Queue Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Region",
            dataIndex: "region",
            key: "region",
        },
    ];

    return (
        <List title="SQS Queues">
            <Table {...tableProps} columns={columns} rowKey="id" />
            <button
                onClick={() => navigate("/sqs/create")}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                New Queue
            </button>
        </List>
    );
};

export default SQSQueuesPage;
