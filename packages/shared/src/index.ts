export type TUnitValue = "seconds" | "minutes" | "hours" | "days";

export type TUnit = {
    label: string;
    value: TUnitValue;
    multiplier: number;
};
