import React from "react";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { TopBar } from "./TopBar";

export const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemedLayoutV2
            Header={() => <TopBar />}
        >
            {children}
        </ThemedLayoutV2>
    );
};
