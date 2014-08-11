(function ($window) {
    'use strict';

    var DataFilter = (function () {

        function toCSV(data, delimiter) {
            delimiter = delimiter || ';';
            var rows = data.map(function (row) {
                var colls = Object.keys(row).map(function (key) {
                    return row.attrs[key];
                });
                return colls.join(delimiter);
            });
            return rows.join('\n');
        }

        function format(v, f) {
            return f ? f.call(null, v) : v;
        }

        function toArray(nodeList) {
            return Array.prototype.slice.call(nodeList, 0);
        }

        function objectToArray(obj, handler) {
            handler = handler || function (k, v) { return {'key': k, 'value': v}; };
            return Object.keys(obj).map(function (key) {
                return handler.call(null, key, obj[key], obj);
            });
        }

        function arrayToObject(data, handler) {
            // handler should return object {'key': '<>', 'value': '<>'}
            handler = handler || function (x) { return {'key': x.key, 'value': x.value}; };

            var result = {};
            data.forEach(function (item) {
                var obj = handler.call(null, item);
                if (!obj.hasOwnProperty('key')) {
                    throw 'Object has no key';
                }
                if (!obj.hasOwnProperty('value')) {
                    throw 'Object has no value';
                }
                result[obj.key] = obj.value;
            });
            return result;
        }

        function createObjectWith(keys, handler) {
            //if handler wasn't provided, then fill object with null
            handler = handler || function () { return null; };
            var dest = {};
            keys.forEach(function (key) {
                dest[key] = handler.call(null, Array.prototype.slice.call(arguments));
            });
            return dest;
        }

        function collectValuesToObject(source) {
            var dest = {};
            source.forEach(function (item) {
                Object.keys(item.attrs).forEach(function (key) {
                    var value = item.attrs[key];
                    if (!dest[key]) {
                        dest[key] = [];
                    }
                    if (dest[key].indexOf(value) === -1) {
                        // add only unique values
                        dest[key].push(value);
                    }
                });
            });
            return dest;
        }

        function $DOMNodeData(node, fields, handleValue) {
            handleValue = handleValue || function (x) { return x; };
            var obj = {'attrs': {}, '$': node};

            fields.forEach(function (field) {
                obj.attrs[field] = handleValue(node.getAttribute('data-' + field), field);
            });
            return obj;
        }

        function $DOM2Data(fields, nodes) {
            var nodeList = toArray(nodes);

            return nodeList.map(function (node) {
                return $DOMNodeData(node, Object.keys(fields), function (value, field) {
                    return format(value, fields[field].formatter);
                });
            });
        }

        function filterItems(data, key, value) {
            return data.filter(function (item) {
                return item.attrs[key] == value;
            });
        }

        function searchData(data, filters, removeEmpty) {
            var result = data.slice(0);

            Object.keys(filters).forEach(function (key) {
                var value = filters[key];
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

        function createChoices(data, filters, fields) {
            var result     = collectValuesToObject(data),
                filterList = objectToArray(filters);

            filterList.forEach(function (filter) {
                var rest    = filterList.filter(function (f) { return f.key !== filter.key && f.value !== null; }),
                    found   = searchData(data, arrayToObject(rest), false),
                    current = collectValuesToObject(found);
                result[filter.key] = current[filter.key];
            });

            Object.keys(fields).forEach(function (key) {
                var sorter = fields[key].sorter;
                if (sorter) {
                    result[key].sort(sorter);
                }
            });
            return result;
        }

        function filter(data, filters, fields, handler) {
            handler = handler || function () { return; };
            var found   = searchData(data, filters, true),
                choices = createChoices(data, filters, fields);

            handler.call(null, found, choices, filters);

            return {
                'data':    found,
                'choices': choices
            };
        }

        function initFilters(fields) {
            return createObjectWith(Object.keys(fields));
        }

        return {
            'initFilters': initFilters,
            'filter':      filter,
            '$DOM2Data':   $DOM2Data,
            'export': {
                'toCSV': toCSV
            }
        };
    }());

    $window.DataFilter = DataFilter;

}(this));
