import React, { useState } from "react";
import { Form, InputNumber, Select, Space } from "antd";
import { Rule } from "antd/es/form";
import { TUnit, TUnitValue } from "@simple-dashboard/shared";

type UnitInputProps = {
  fieldName: string;
  label: string;
  units: TUnit[];
  rules?: Rule[];
  initialUnit?: TUnitValue;
  initialValue?: number;
  min?: number;
  max?: number;
  errorMessage?: string;
};

const unitMultipliers: Record<TUnitValue, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
};

export const UnitInput: React.FC<UnitInputProps> = ({
  fieldName,
  label,
  units,
  initialUnit = units[0].value,
  initialValue,
  min = 0,
  max = Infinity,
  errorMessage,
}) => {
  const [unit, setUnit] = useState<TUnitValue>(initialUnit);

  return (
    <Form.Item
      label={label}
      required
      style={{ marginBottom: 16 }}
      shouldUpdate={(prev, curr) =>
        prev[fieldName] !== curr[fieldName] ||
        prev[`${fieldName}_unit`] !== curr[`${fieldName}_unit`]
      }
    >
      {({ getFieldValue }) => {
        const currentUnit = getFieldValue(`${fieldName}_unit`) || unit;
        const multiplier = unitMultipliers[currentUnit as TUnitValue];

        return (
          <Space>
            <Form.Item
              name={fieldName}
              noStyle
              rules={[
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null)
                      return Promise.reject("Required");

                    const baseValue = value * multiplier;
                    if (baseValue < min || baseValue > max) {
                      const msg =
                        errorMessage ||
                        `Must be between ${min} and ${max} seconds`;
                      return Promise.reject(msg);
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              initialValue={initialValue}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item name={`${fieldName}_unit`} initialValue={unit} noStyle>
              <Select
                style={{ width: 100 }}
                onChange={(value) => setUnit(value)}
                options={units}
              />
            </Form.Item>
          </Space>
        );
      }}
    </Form.Item>
  );
};
