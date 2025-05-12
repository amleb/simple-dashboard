import { set } from "lodash";

function expandObjectKeys(obj: Record<PropertyKey, unknown>) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    set(result, key, String(value));
  }

  return result;
}

export default expandObjectKeys;
