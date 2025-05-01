import React from "react";
import { Layout, Select } from "antd";
import { useRegion } from "../contexts/RegionContext";

const { Header } = Layout;

const regions = [
    "us-east-1",
    "us-west-1",
    "us-west-2",
    "eu-central-1",
    "eu-west-1",
];

export const TopBar: React.FC = () => {
    const { region, setRegion } = useRegion();

    return (
        <Header style={{ background: "#fff", padding: "0 16px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <span style={{ marginRight: 8 }}>Region:</span>
            <Select
                style={{ width: 160 }}
                value={region}
                onChange={setRegion}
                options={regions.map((r) => ({ value: r, label: r }))}
            />
        </Header>
    );
};
