import { TUnit, TimeUnitValue } from "@simple-dashboard/shared";
import { FieldValues } from "react-hook-form";

export const convertToSeconds = (
  value: number,
  unit: TimeUnitValue,
): number => {
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

export const timeUnitsUpToHours: TUnit<TimeUnitValue>[] = [
  { label: "Seconds", value: "seconds", multiplier: 1 },
  { label: "Minutes", value: "minutes", multiplier: 60 },
  { label: "Hours", value: "hours", multiplier: 3600 },
];

export const timeUnitsUpToDays: TUnit<TimeUnitValue>[] =
  timeUnitsUpToHours.concat({
    label: "Days",
    value: "days",
    multiplier: 86400,
  });

export const convertTimeUnitFieldsToSeconds = (data: FieldValues) => {
  for (const key in data) {
    if (key.endsWith("_time_unit")) {
      const unit = data[key];
      const fieldName = key.replace("_time_unit", "");
      const value = data[fieldName];
      data[fieldName] = convertToSeconds(value, unit);
      delete data[key];
    }
  }

  return data;
};
