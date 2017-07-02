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

function dataToObject<T extends DataFilterMap<any>>(data: T[], fields: DataFilterFields<T>) {
  const result: DataFilterMap<any> = {};
  const keys = getAllowedFiled<T>(fields);

  data.forEach((item, i) => {
    keys.forEach(key => {
      if (!result[key]) {
        result[key] = [null];
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

export function dataFilter<T extends {[key: string]: any}>(fields: DataFilterFields<T>) {
  const keys = Object.keys(fields);
  const size = keys.length;

  const dispatch: DataFilter<T> = (input, payload) => {
    const payloadKeys = Object.keys(payload);

    for (const pk of payloadKeys) {
      if (keys.indexOf(pk) === -1) {
        throw new Error(`Key "${pk}" is not allowed`);
      }
    }

    let choices: DataFilterChoices = dataToObject(input, fields);
    let data = input.slice();

    for (const pk of keys) {
      const field = fields[pk];
      const value = payload[pk];

      data = data.filter(item => {
        // if no value then allow it
        if (value === undefined) {
          return true;
        }

        if (field && field.match) {
          return field.match(item[pk], value);
        }

        return item[pk] === value;
      });

      choices = dataToObject(data, fields);
    }


    return {
      choices,
      data
    };
  };

  return dispatch;
}