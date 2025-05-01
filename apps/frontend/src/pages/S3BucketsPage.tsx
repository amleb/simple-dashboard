import React from "react";
import { useTable } from "@refinedev/antd";
import { List } from "@refinedev/antd";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useRegion } from '../contexts/RegionContext';

type SqsQueue = {
    id: string;
    name: string;
    region: string;
};

const SQSQueuesPage: React.FC = () => {
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
            title: "Bucket Name",
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
        <List title="S3 Buckets">
            <Table {...tableProps} columns={columns} rowKey="id" />
        </List>
    );
};

export default SQSQueuesPage;
