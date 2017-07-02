export interface DataFilterMap<T> {
  [key: string]: T;
}

export interface DataFilterField<T> {
  name?: string;
  format?: (value: any, row: T) => any;
  match?: (item: T, value: any) => boolean;
  serialize?: (item: any, index?: number) => string;
  ignore?: boolean;
}

export type DataFilterFields<T> = Partial<Record<keyof T, DataFilterField<T>>>;

export type DataFilterChoices = DataFilterMap<any>;

export interface DataFilter<T> {
  (data: T[], payload: DataFilterMap<any>): {
    data: T[];
    choices: {
      [key: string]: any[]
    }
  }
}

export interface DataFilterPick {
  key: string;
  value: any;
}

/**
 * Pick keys from the first argument and values from the second,
 * combine them and fold to an array;
 * @param keysFrom keys source
 * @param valuesFrom values source
 */
function pickObjectsToArray(keysFrom: any, valuesFrom: any): DataFilterPick[] {
  const keys = Object.keys(keysFrom);

  return keys.map(key => {
    return {
      key,
      value: valuesFrom[key]
    };
  });
}

function pickArrayToObject(data: DataFilterPick[]) {
  return data.reduce((acc: DataFilterMap<any>, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

function getAllowedFiled<T>(fields: DataFilterFields<T>) {
  const keys = Object.keys(fields);
  return keys.filter(key => {
    const field = fields[key];

    if (field && field.ignore) {
      return !field.ignore;
    }
    return true;
  });
}

function collectValues<T extends DataFilterMap<any>>(data: T[], fields: DataFilterFields<T>) {
  const result: DataFilterMap<any> = {};
  const keys = getAllowedFiled<T>(fields);

  data.forEach((item, i) => {
    keys.forEach(key => {
      if (!result[key]) {
        result[key] = [];
      }

      const field = fields[key];
      const value = item[key];
      const uniqueValue = field && field.serialize
        ? field.serialize(value, i)
        : value;

      if (result[key].indexOf(uniqueValue) === -1) {
        result[key].push(uniqueValue);
      }
    });
  });
  return result;
}

function filterItems<T extends DataFilterMap<any>>(
    data: T[],
    fields: DataFilterFields<T>,
    payload: DataFilterMap<any>) {

  const keys = Object.keys(fields);
  const size = keys.length;

  return data.filter(item => {
    const success = keys.filter(pk => {
      const field = fields[pk];
      const value = payload[pk];

      if (value === undefined) {
        return true;
      }

      if (field && field.match) {
        return field.match(item[pk], value);
      }

      return item[pk] === value;
    });

    return success.length === size;
  });
}

function createChoices<T extends DataFilterMap<any>>(
    data: T[],
    fields: DataFilterFields<T>,
    payload: DataFilterMap<any>) {
  const initialChoices = collectValues(data, fields);
  if (Object.keys(payload).length === 0) {
    return initialChoices;
  }

  const payloadList = pickObjectsToArray(fields, payload);
  const choices: DataFilterChoices = payloadList.reduce((acc, curr) => {
    const currPayloadList = payloadList.filter(f => f.key !== curr.key && f.value !== undefined);
    const currPayload = pickArrayToObject(currPayloadList);
    const found = filterItems(data, fields, currPayload);
    const values = collectValues(found, fields);

    acc[curr.key] = values[curr.key];

    return acc;
  }, collectValues(data, fields));

  return choices;
}

export function dataFilter<T>(fields: DataFilterFields<T>) {
  const dispatch: DataFilter<T> = (data, payload) => {
    return {
      data: filterItems(data, fields, payload),
      choices: createChoices(data, fields, payload)
    };
  };
  return dispatch;
}