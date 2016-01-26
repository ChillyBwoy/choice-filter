function objectToArray (obj, handler = (k, v) => {
  return {key: k, value: v};
}) {
  return Object.keys(obj).map(key => handler.call(null, key, obj[key], obj));
}

function arrayToObject (data, handler = (x) => {
  // handler should return object {'key': '<>', 'value': '<>'}
  return {key: x.key, value: x.value};
}) {
  return data.reduce((acc, curr) => {
    let obj = handler.call(null, curr);
    if (!obj.hasOwnProperty('key')) {
      throw new Error('Object has no key');
    }
    if (!obj.hasOwnProperty('value')) {
      throw new Error('Object has no value');
    }
    acc[obj.key] = obj.value;
    return acc;
  }, {});
}

function createObjectWith (keys, handler = () => null) {
  // if handler wasn't provided, then fill object with null
  return keys.reduce((acc, curr) => {
    acc[curr] = handler.call(null, Array.prototype.slice.call(arguments));
    return acc;
  }, {});
}

function collectValuesToObject (source) {
  return source.reduce((prev, curr) => {
    Object.keys(curr.attrs).forEach(key => {
      let value = curr.attrs[key];
      if (!(key in prev)) {
        prev[key] = [];
      }
      if (prev[key].indexOf(value) === -1) {
        // add only unique values
        prev[key] = prev[key].concat(value);
      }
    });
    return prev;
  }, {});
}

function filterItems (data, key, value) {
  return data.filter(item => item.attrs[key] == value);
}

function searchData (data, filters, removeEmpty = false) {
  let result = data.slice(0);

  Object.keys(filters).forEach(key => {
    let value = filters[key];
    if (removeEmpty) {
      if (value !== null) {
        result = filterItems(result, key, value);
      }
    } else {
      result = filterItems(result, key, value);
    }
  });
  return result;
}

function createChoices (data, filters, fields) {
  let result = collectValuesToObject(data);
  let filterList = objectToArray(filters);

  filterList.forEach(filter => {
    let rest = filterList.filter(f => f.key !== filter.key && f.value !== null);
    let found = searchData(data, arrayToObject(rest), false);
    let current = collectValuesToObject(found);
    result[filter.key] = current[filter.key];
  });

  Object.keys(fields).forEach(key => {
    let sorter = fields[key].sorter;
    if (sorter) {
      // mutable
      result[key].sort(sorter);
    }
  });
  return result;
}

export function filter (data, filters, fields, handler = () => null) {
  let found = searchData(data, filters, true);
  let choices = createChoices(data, filters, fields);

  handler.call(handler, found, choices, filters);

  return {
    data: found,
    choices: choices
  };
}

export function initFilters (fields) {
  return createObjectWith(Object.keys(fields));
}
