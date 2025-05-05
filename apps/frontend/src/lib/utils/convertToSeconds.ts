import { TUnit, TUnitValue } from "@simple-dashboard/shared";

const convertToSeconds = (value: number, unit: TUnitValue): number => {
  switch (unit) {
    case "seconds":
      return value;
    case "minutes":
      return value * 60;
    case "hours":
      return value * 3600;
    case "days":
      return value * 86400;
    default:
      return value;
  }
};

export const timeUnitsUpToHours: TUnit[] = [
  { label: "Seconds", value: "seconds", multiplier: 1 },
  { label: "Minutes", value: "minutes", multiplier: 60 },
  { label: "Hours", value: "hours", multiplier: 3600 },
];

export const timeUnitsUpToDays: TUnit[] = timeUnitsUpToHours.concat({
  label: "Days",
  value: "days",
  multiplier: 86400,
});

export default convertToSeconds;
