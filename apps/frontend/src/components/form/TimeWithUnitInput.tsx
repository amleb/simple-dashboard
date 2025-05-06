import React, { useState } from "react";
import { Form, InputNumber, Select, Space } from "antd";
import { Rule } from "antd/es/form";
import { TUnit, TimeUnitValue } from "@simple-dashboard/shared";
import { convertToSeconds } from "../../lib/utils/convertToSeconds";

type UnitInputProps = {
  fieldName: string;
  label: string;
  units: TUnit<TimeUnitValue>[];
  rules?: Rule[];
  initialUnit?: TimeUnitValue;
  initialValue?: number;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export const TimeWithUnitInput: React.FC<UnitInputProps> = ({
  fieldName,
  label,
  units,
  initialUnit = units[0].value,
  initialValue,
  min = 0,
  max = Infinity,
  errorMessage,
}) => {
  const [unit, setUnit] = useState<TimeUnitValue>(initialUnit);

  return (
    <Form.Item
      label={label}
      required
      style={{ marginBottom: 16 }}
      shouldUpdate={(prev, curr) =>
        prev[fieldName] !== curr[fieldName] ||
        prev[`${fieldName}_time_unit`] !== curr[`${fieldName}_time_unit`]
      }
    >
      {({ getFieldValue }) => {
        const currentUnit = getFieldValue(`${fieldName}_time_unit`) || unit;

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

                    const baseValue = convertToSeconds(value, currentUnit);
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

            <Form.Item
              name={`${fieldName}_time_unit`}
              initialValue={unit}
              noStyle
            >
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
