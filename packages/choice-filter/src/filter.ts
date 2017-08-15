export type ChoiceFilterMap<T> = {
  [key: string]: T;
}

export type ChoiceFilterFields<T> = Partial<Record<keyof T, ChoiceFilterField>>;
export type ChoiceFilterChoices = ChoiceFilterMap<any[]>;
export type ChoiceFilterPayload = ChoiceFilterMap<any[]>;

export interface ChoiceFilterField {
  name?: string;
  match?: (item: any, value: any[]) => boolean;
  serialize?: (item: any, index?: number) => string;
  ignore?: boolean;
}

export interface ChoiceFilter<T> {
  (data: T[], payload: ChoiceFilterMap<any>): {
    data: T[];
    choices: ChoiceFilterChoices;
  }
}

export interface ChoiceFilterPick {
  key: string;
  value: any;
}

/**
 * Pick keys from the first argument and values from the second,
 * combine them and fold to an array;
 * @param keysFrom keys source
 * @param valuesFrom values source
 */
function pick(
    keys: string[],
    valuesFrom: any): ChoiceFilterPick[] {
  return keys.map(key => {
    return {
      key,
      value: valuesFrom[key]
    };
  });
}

function pickArrayToObject(data: ChoiceFilterPick[]) {
  return data.reduce((acc: ChoiceFilterMap<any>, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

function getAllowedFiled<T>(fields: ChoiceFilterFields<T>) {
  const keys = Object.keys(fields);
  return keys.filter(key => {
    const field = fields[key];

    if (field && field.ignore) {
      return !field.ignore;
    }
    return true;
  });
}

function collectValues<T extends ChoiceFilterMap<any>>(data: T[], fields: ChoiceFilterFields<T>) {
  const result: ChoiceFilterMap<any> = {};
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

function filterItems<T extends ChoiceFilterMap<any>>(
    data: T[],
    fields: ChoiceFilterFields<T>,
    payload: ChoiceFilterMap<any[]>) {

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

function createChoices<T extends ChoiceFilterMap<any>>(
    data: T[],
    fields: ChoiceFilterFields<T>,
    payload: ChoiceFilterMap<any>) {
  const initialChoices = collectValues(data, fields);
  if (Object.keys(payload).length === 0) {
    return initialChoices;
  }
  console.log(payload);
  const payloadList = pick(Object.keys(fields), payload);
  const choices: ChoiceFilterChoices = payloadList.reduce((acc, curr) => {
    const currPayloadList = payloadList.filter(f => {
      return f.key !== curr.key && f.value !== undefined;
    });
    const currPayload = pickArrayToObject(currPayloadList);
    const found = filterItems(data, fields, currPayload);
    const values = collectValues(found, fields);

    acc[curr.key] = values[curr.key];

    return acc;
  }, collectValues(data, fields));

  return choices;
}

export default function choiceFilter<T>(fields: ChoiceFilterFields<T>) {
  const dispatch: ChoiceFilter<T> = (data, payload) => {
    return {
      data: filterItems(data, fields, payload),
      choices: createChoices(data, fields, payload)
    };
  };
  return dispatch;
}