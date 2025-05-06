export type TimeUnitValue = "seconds" | "minutes" | "hours" | "days";

export type SizeUnitValue = "bytes" | "kilobytes" | "megabytes" | "gigabytes";

export type TUnit<T extends TimeUnitValue | SizeUnitValue> = {
    label: string;
    value: T;
    multiplier: number;
};
