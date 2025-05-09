import _ from "lodash";

function flattenObjectKeys(obj: object, parent = "", res: Record<PropertyKey, string> = {}) {
  return _.transform(
    obj,
    (result, value, key) => {
      const newKey = parent ? `${parent}.${String(key)}` : key;
      if (_.isObject(value) && !_.isArray(value)) {
        flattenObjectKeys(value, String(newKey), result);
      } else {
        result[newKey] = value;
      }
    },
    res,
  );
}

export default flattenObjectKeys;
