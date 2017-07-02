export interface DataFilterMap<T> {
  [key: string]: T;
}

export interface DataFilterField<T> {
  format?: (value: any, row: T) => any;
  match?: (item: T, value: any) => boolean;
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

function dataToObject<T extends DataFilterMap<any>>(data: T[]) {
  const result: DataFilterMap<any> = {};
  for (const item of data) {
    const keys = Object.keys(item);

    keys.forEach(key => {
      if (!result[key]) {
        result[key] = [null];
      }

      const value = item[key];

      if (result[key].indexOf(value) === -1) {
        result[key].push(value);
      }
    });
  }
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

    const choices: DataFilterChoices = dataToObject(input);

    const data = input.slice().filter(item => {
      // iterate through all keys
      const success = keys.filter(pk => {
        const value = payload[pk];
        const field = fields[pk];

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

    return {
      choices,
      data
    };
  };

  return dispatch;
}