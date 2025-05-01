import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type RegionContextType = {
    region: string;
    setRegion: (region: string) => void;
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const REGION_KEY = "selectedAwsRegion";

export const RegionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [region, setRegionState] = useState<string>("us-east-1");

    useEffect(() => {
        const storedRegion = localStorage.getItem(REGION_KEY);
        if (storedRegion) {
            setRegionState(storedRegion);
        }
    }, []);

    const setRegion = (newRegion: string) => {
        localStorage.setItem(REGION_KEY, newRegion);
        setRegionState(newRegion);
    };

    return (
        <RegionContext.Provider value={{ region, setRegion }}>
            {children}
        </RegionContext.Provider>
    );
};

export const useRegion = (): RegionContextType => {
    const context = useContext(RegionContext);
    if (!context) {
        throw new Error("useRegion must be used within a RegionProvider");
    }
    return context;
};
