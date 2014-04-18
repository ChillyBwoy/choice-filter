(function() {
    'use strict';

    var DataFilter = (function() {

        function toCSV (data, delimiter) {
            delimiter = delimiter || ';';
            var rows = data.map(function (item) {
                var colls = [];
                for (var coll in item) {
                    if (item.hasOwnProperty(coll)) {
                        colls.push(item[coll]);
                    }
                }
                return colls.join(delimiter);
            });
            return rows.join('\n');
        }

        function format (v, f) {
            return f ? f.call(null, v) : v;
        }

        function toArray (nodeList) {
            return Array.prototype.slice.call(nodeList, 0);
        }

        function objectToArray (obj, handler) {
            handler = handler || function (k, v) {return {'key': k, 'value': v};};
            var result = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var item = handler.call(null, key, obj[key], obj);
                    result.push(item);
                }
            }
            return result;
        }

        function arrayToObject (data, handler) {
            // handler should return object {'key': '<>', 'value': '<>'}
            handler = handler || function (x) { return {'key': x.key, 'value': x.value};};

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

        function createObjectWith (keys, handler) {
            //if handler wasn't provided, then fill object with null
            handler = handler || function () { return null; };
            var dest = {};
            keys.forEach(function (key, i, _) {
                dest[key] = handler.call(null, key, i, _);
            });
            return dest;
        }

        function collectValuesToObject (source) {
            var dest = {};
            source.forEach(function (item) {
                for (var name in item) {
                    if (item.hasOwnProperty(name)) {
                        var value = item[name];
                        if (!dest[name]) {
                            dest[name] = [];
                        }
                        if (dest[name].indexOf(value) === -1) {
                            // add only unique values
                            dest[name].push(value);
                        }
                    }
                }
            });
            return dest;
        }

        function $DOMNodeData (node, fields, handleValue) {
            handleValue = handleValue || function (x) { return x; };
            var obj = {};
            fields.forEach(function (field) {
                obj[field] = handleValue(node.getAttribute('data-' + field), field);
            });
            return obj;
        }

        function $DOM2Data (fields, nodes) {
            var nodeList = toArray(nodes);

            return nodeList.map(function (node) {
                return $DOMNodeData(node, Object.keys(fields), function (value, field) {
                    return format(value, fields[field].formatter);
                });
            });
        }

        function sortChoices (choices, fields) {
            // $.each(result, function (name) {
            //     // sorting
            //     if (fields.hasOwnProperty(name)) {
            //         var sorter = fields[name].sorter;
            //         if (sorter) {
            //             result[name].sort(sorter);
            //         }
            //     }
            // });
            return choices;
        }

        function createChoices (data, filters) {
            var result     = collectValuesToObject(data),
                filterList = objectToArray(filters);

            filterList.forEach(function (filter) {
                var rest    = filterList.filter(function (f) {
                                return f.key !== filter.key && f.value !== null;
                            }),
                    found   = searchData(data, arrayToObject(rest), false),
                    current = collectValuesToObject(found);

                result[filter.key] = current[filter.key];
            });
            return result;
        }

        function filterItems (data, key, value) {
            return data.filter(function (item) {
                return item[key] == value;
            });
        }

        function searchData (data, filters, removeEmpty) {
            var result = data.slice(0);
            for (var key in filters) {
                if (filters.hasOwnProperty(key)) {
                    var value  = filters[key];
                    if (removeEmpty) {
                        if (value !== null) {
                            result = filterItems(result, key, value);
                        }
                    } else {
                        result = filterItems(result, key, value);
                    }
                }
            }
            return result;
        }

        function filter (data, filters, handler) {
            handler = handler || function () {};
            var found   = searchData(data, filters, true),
                choices = createChoices(data, filters);

            handler.call(null, found, choices, filters);

            return {
                'data':    found,
                'choices': choices
            };
        }

        function initFilters (fields) {
            return createObjectWith(Object.keys(fields));
        }


        // DataFilter.prototype.bindAll = function () {
        //     var self   = this,
        //         fields = this.fields;

        //     // TODO: kill jQuery
        //     $.each(this.choices, function(name) {
        //         var node = fields[name].$;

        //         node.on('change', function (event) {
        //             event.preventDefault();

        //             var value = node.val();

        //             var filterIsInStack = self.filters.filter(function (item) {
        //                 return item.name === name;
        //             });

        //             if (value) {
        //                 if (filterIsInStack.length) {
        //                     self.filters = self.filters.filter(function (item) {
        //                                             return item.name !== name;
        //                                         });
        //                 }
        //                 self.filters.push({'name': name, 'value': value});
        //             } else {
        //                 self.filters = self.filters.filter(function (item) {
        //                                         return item.name !== name;
        //                                     });
        //             }

        //             var found    = search(self.data.slice(0), self.filters.slice(0));

        //             self.choices = createChoices(fields, self.data, self.filters);
        //             // buildNodes(fields, self.choices, self.filters);
        //             self.handler.call(this, found, self.filters, self.filters.length === 0);
        //         });
        //     });
        //     return this;
        // };

        // return DataFilter;

        return {
            'initFilters': initFilters,
            'filter':      filter,
            '$DOM2Data':   $DOM2Data,
            'export': {
                'toCSV': toCSV
            }
        };
    }());

    window.DataFilter = DataFilter;



}());
