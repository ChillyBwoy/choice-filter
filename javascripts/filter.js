(function() {
    'use strict';

    var DataFilter = (function() {

        var debug = {
            byFieldCount: function (obj) {
                var res = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        res.push(key + ': ' + obj[key].length);
                    }
                }
                return res.join(', ');
            }
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
                    throw "Object has no key";
                }
                if (!obj.hasOwnProperty('value')) {
                    throw "Object has no value";
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

        function sortChoices (choices) {
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
            var result = collectValuesToObject(data);

            var filterList = objectToArray(filters);

            filterList.forEach(function (filter) {
                var rest  = filterList.filter(function (f) {
                                return f.key !== filter.key && f.value !== null;
                            }),
                    found = searchData(data, arrayToObject(rest), false);

                result[filter.key] = [];
                result = collectValuesToObject(found);
            });
            return result;
        }

        function searchData (data, filters, removeEmpty) {
            var result = data.slice(0);
            for (var key in filters) {
                if (filters.hasOwnProperty(key)) {
                    var value  = filters[key];
                    if (removeEmpty) {
                        if (value !== null) {
                            result = result.filter(function (item) {
                                return item[key] == value;
                            });
                        }
                    } else {
                        result = result.filter(function (item) {
                            return item[key] == value;
                        });
                    }
                
                }
            }
            return result;

            // var filterList = objectToArray(filters);

            // if (removeEmpty) {
            //     filterList = filterList.filter(function (f) {
            //         return f.value !== null;
            //     });
            // }

            // if (filterList.length === 0) {
            //     return data;
            // }
            // var filter = filterList.shift(),
            //     result = data.filter(function (item) {
            //                 return (item[filter.key] == filter.value);
            //             });
            // return searchData(result, arrayToObject(filterList), removeEmpty);
        }

        // function buildNodes (fields, choices, filters) {
        //     var optionTag = function (value, label) {
        //         return $('<option/>').attr('value', value).text(label);
        //     };

        //     // TODO: kill jQuery
        //     $.each(fields, function (name, field) {
        //         var node       = field.$,
        //             emptyLabel = node.data('filter-emptylabel');

        //         node.text('');
        //         node.append(optionTag('', emptyLabel));

        //         choices[name].forEach(function (item) {
        //             node.append(optionTag(item, item));
        //         });
        //     });

        //     // TODO: kill jQuery
        //     $.each(filters, function (i, item) {
        //         var node = fields[item.name].$;
        //         node.val(item.value);
        //     });
        // }





        // function toCSV (data) {
        //     return data.map(function (item) {
        //         var res = [];
        //         $.each(item.values, function (k, v) {
        //             res.push(v);
        //         });
        //         return res.join(';');
        //     }).join('\n');
        // }




        var DataFilter = function ($nodes, fields, handler) {
            // this.$nodes  = $nodes;
            // this.fields  = fields;
            // this.handler = handler || function() {};

            var data    = $DOM2Data(fields, $nodes),
                filters = createObjectWith(Object.keys(fields));
                // choices = createChoices(data, filters);

            // var filters    = {};
            filters.age    = '21'
            filters.mobile = 'Android'
            filters.fruit  = 'banana'
            filters.gender = 'female'

            
            console.log('  Found: ', searchData(data, filters, true).length);
            console.log('Choices: ', debug.byFieldCount(createChoices(data, filters)));

            // this.choices = createChoices(fields, this.data, this.filters);

            // buildNodes(this.fields, this.choices, this.filters);

            // this.bindAll();
        };








        DataFilter.prototype.bindAll = function () {
            var self   = this,
                fields = this.fields;

            // TODO: kill jQuery
            $.each(this.choices, function(name) {
                var node = fields[name].$;

                node.on('change', function (event) {
                    event.preventDefault();

                    var value  = node.val();

                    if (value instanceof Array) {
                        value = value[0];
                    }

                    var filterIsInStack = self.filters.filter(function (item) {
                        return item.name === name;
                    });

                    if (value) {
                        if (filterIsInStack.length) {
                            self.filters = self.filters.filter(function (item) {
                                                    return item.name !== name;
                                                });
                        }
                        self.filters.push({'name': name, 'value': value});
                    } else {
                        self.filters = self.filters.filter(function (item) {
                                                return item.name !== name;
                                            });
                    }

                    var found    = search(self.data.slice(0), self.filters.slice(0));

                    self.choices = createChoices(fields, self.data, self.filters);
                    // buildNodes(fields, self.choices, self.filters);
                    self.handler.call(this, found, self.filters, self.filters.length === 0);
                });
            });
            return this;
        };

        return DataFilter;
    }());

    window.DataFilter = DataFilter;



}());
