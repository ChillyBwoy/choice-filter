(function($) {
    'use strict';

    var Filter = (function() {

        var format = function format (v, f) {
            return f ? f.call(null, v) : v;
        };

        function unique (source, dest) {
            source.forEach(function (item) {
                // only unique values
                $.each(item.values, function (name, value) {
                    if (dest[name].indexOf(value) === -1) {
                        dest[name].push(value);
                    }
                });
            });
            return dest;
        }

        function initData (fields, $nodes) {
            return $nodes.map(function (i, item) {
                var node    = $(item),
                    element = {
                        // save DOM-element.
                        $:      node,
                        _:      {},
                        values: {}};

                $.each(fields, function (name, field) {
                    var prop = node.data(name);
                    // _      - original values
                    // values - formated values
                    element._[name]      = prop;
                    element.values[name] = format(prop, field.formatter);
                });
                return element;
            }).toArray();
        }

        function initFilters (fields, data, filterStack) {
            var result  = {},
                filters = filterStack.slice(0);

            // create keys
            $.each(fields, function (name) {
                result[name] = [];
                var filterIsInStack = filters.filter(function (item) {
                    return item.name === name;
                });

                if (!filterIsInStack.length) {
                    filters.push({'name': name, 'value': null});
                }
            });

            result = unique(data, result);


            filters.forEach(function (currentFilter) {
                var rest  = filters.filter(function (f) {
                                return f.value && f.name !== currentFilter.name;
                            }),
                    found = search(data, rest);

                result[currentFilter.name] = [];
                result = unique(found, result);
            });
            

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

        function buildNodes (fields, filters, filterStack) {
            var optionTag = function (value, label) {
                return $('<option/>').attr('value', value).text(label);
            };

            $.each(fields, function (name, field) {
                var node       = field.$,
                    emptyLabel = node.data('filter-emptylabel');

                node.text('');
                node.append(optionTag('', emptyLabel));

                filters[name].forEach(function (item) {
                    node.append(optionTag(item, item));
                });
            });

            $.each(filterStack, function (i, item) {
                var node = fields[item.name].$;
                node.val(item.value);
            });
        }

        function search (data, filterStack) {
            if (filterStack.length === 0) {
                return data;
            }

            var filter  = filterStack.shift(),
                results = data.filter(function (item) {
                            return (item.values[filter.name] == filter.value);
                        });
            return search(results, filterStack);
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

        var Filter = function ($nodes, fields, handler) {
            this.$nodes  = $nodes;
            this.fields  = fields;
            this.handler = handler || function() {};

            this.filterStack = [];

            this.data    = initData(fields, $nodes);
            this.filters = initFilters(fields, this.data, this.filterStack);

            buildNodes(this.fields, this.filters, this.filterStack);
            this.bindAll();
        };

        Filter.prototype.bindAll = function () {
            var self   = this,
                fields = this.fields;

            $.each(this.filters, function(name) {
                var node = fields[name].$;

                node.on('change', function (event) {
                    event.preventDefault();

                    var value  = node.val();

                    if (value instanceof Array) {
                        value = value[0];
                    }

                    var filterIsInStack = self.filterStack.filter(function (item) {
                        return item.name === name;
                    });

                    if (value) {
                        if (filterIsInStack.length) {
                            self.filterStack = self.filterStack.filter(function (item) {
                                                    return item.name !== name;
                                                });
                        }
                        self.filterStack.push({'name': name, 'value': value});
                    } else {
                        self.filterStack = self.filterStack.filter(function (item) {
                                                return item.name !== name;
                                            });
                    }

                    var found    = search(self.data.slice(0), self.filterStack.slice(0)),
                        elements = $.map(found, function (item) { return item.$[0]; });

                    self.filters = initFilters(fields, self.data, self.filterStack);

                    buildNodes(fields, self.filters, self.filterStack);
                    self.handler.call(this, self.filterStack, $(elements),
                                      self.$nodes,
                                      self.filterStack.length === 0);
                });
            });
            return this;
        };

        return Filter;
    }());

    $.fn.Filter = function (fields, handler) {
        this.filter = new Filter(this, fields, handler);
        return this;
    };

}(window.jQuery));
