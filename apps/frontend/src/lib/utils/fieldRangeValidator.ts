import { RuleObject } from "antd/es/form";

const validateRange = (min: number, max: number, unit?: string) => {
  return () => ({
    validator(_: RuleObject, value: number) {
      if (value === undefined || value === null)
        return Promise.reject("Required");

      if (value < min || value > max) {
        return Promise.reject(
          `Must be between ${min} and ${max} ${unit || ""}`,
        );
      }
      return Promise.resolve();
    },
  });
};

export default validateRange;
