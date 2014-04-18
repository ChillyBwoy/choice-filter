(function($) {
    'use strict';

    var DataFilter = (function() {

        function format (v, f) {
            return f ? f.call(null, v) : v;
        }

        function initWithKeysAndArrays (keys) {
            var dest = {};
            keys.forEach(function (key) {
                dest[key] = [];
            });
            return dest;
        }

        function unique (source, dest) {
            source.forEach(function (item) {
                // only unique values
                for (var name in item.values) {
                    var value = item.values[name];
                    if (dest[name].indexOf(value) === -1) {
                        dest[name].push(value);
                    }
                }
            });
            return dest;
        }

        function initData (fields, $nodes) {
            // TODO: kill jQuery
            return $nodes.map(function (i, item) {
                var node    = $(item),
                    element = {
                        // save DOM-element.
                        $:      node,
                        _:      {},
                        values: {}};

                for (var name in fields) {
                    var field = fields[name],
                        prop  = node.data(name);
                    // _      - original values
                    // values - formated values
                    element._[name]      = prop;
                    element.values[name] = format(prop, field.formatter);
                }
                return element;
            }).toArray();
        }

        function generateFilters (fields, data, filters) {
            var result  = initWithKeysAndArrays(Object.keys(fields)),
                newFilters = filters.slice(0);

            // TODO: kill jQuery
            $.each(fields, function (name) {
                var filterIsInStack = newFilters.filter(function (item) {
                    return item.name === name;
                });

                if (!filterIsInStack.length) {
                    newFilters.push({'name': name, 'value': null});
                }
            });

            result = unique(data, result);

            newFilters.forEach(function (currentFilter) {
                var rest  = newFilters.filter(function (f) {
                                return f.value && f.name !== currentFilter.name;
                            }),
                    found = search(data, rest);

                result[currentFilter.name] = [];
                result = unique(found, result);
            });
            

            // TODO: kill jQuery
            $.each(result, function (name) {
                // sorting
                if (fields.hasOwnProperty(name)) {
                    var sorter = fields[name].sorter;
                    if (sorter) {
                        result[name].sort(sorter);
                    }
                }
            });
            return result;
        }

        function buildNodes (fields, choices, filters) {
            var optionTag = function (value, label) {
                return $('<option/>').attr('value', value).text(label);
            };

            // TODO: kill jQuery
            $.each(fields, function (name, field) {
                var node       = field.$,
                    emptyLabel = node.data('filter-emptylabel');

                node.text('');
                node.append(optionTag('', emptyLabel));

                choices[name].forEach(function (item) {
                    node.append(optionTag(item, item));
                });
            });

            // TODO: kill jQuery
            $.each(filters, function (i, item) {
                var node = fields[item.name].$;
                node.val(item.value);
            });
        }

        function search (data, filters) {

            if (filters.length === 0) {
                return data;
            }

            var filter  = filters.shift(),
                results = data.filter(function (item) {
                            return (item.values[filter.name] == filter.value);
                        });
            return search(results, filters);
        }

        function toCSV (data) {
            return data.map(function (item) {
                var res = [];
                $.each(item.values, function (k, v) {
                    res.push(v);
                });
                return res.join(';');
            }).join('\n');
        }

        var DataFilter = function ($nodes, fields, handler) {
            this.$nodes  = $nodes;
            this.fields  = fields;
            this.handler = handler || function() {};

            this.filters = [];

            this.data    = initData(fields, $nodes);
            this.choices = generateFilters(fields, this.data, this.filters);

            buildNodes(this.fields, this.choices, this.filters);
            this.bindAll();
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

                    var found    = search(self.data.slice(0), self.filters.slice(0)),
                        elements = $.map(found, function (item) { return item.$[0]; });

                    self.choices = generateFilters(fields, self.data, self.filters);

                    buildNodes(fields, self.choices, self.filters);
                    self.handler.call(this, self.filters, $(elements),
                                      self.$nodes,
                                      self.filters.length === 0);
                });
            });
            return this;
        };

        return DataFilter;
    }());

    window.DataFilter = DataFilter;



}(window.jQuery));
