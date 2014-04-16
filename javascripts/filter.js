(function($) {
    'use strict';

    var Filter = (function() {

        var format = function format (v, f) {
            return f ? f.call(null, v) : v;
        };

        function initData (fields, $nodes) {
            return $nodes.map(function (i, item) {
                var node    = $(item),
                    element = {
                        // На всякий пожарный сохраняем DOM-элемент.
                        $:      node,
                        _:      {},
                        values: {}};

                $.each(fields, function (name, field) {
                    var prop = node.data(name);
                    // Сохраняем в _ оригинальные значения 
                    // и в values отфоматированные
                    element._[name]      = prop;
                    element.values[name] = format(prop, field.formatter);
                });
                return element;
            }).toArray();
        }

        function initFilters (fields, data, filterStack) {
            var result = {};

            // создаём ключи
            $.each(fields, function (name) {
                result[name] = [];
            });

            var unique = function unique (source, dest, except) {
                $.each(source, function (i, item) {
                    // добавляем в сет только оригинальные значения
                    $.each(item.values, function (name, value) {
                        if (dest[name].indexOf(value) === -1) {
                            dest[name].push(value);
                        }
                    });
                });
            };

            unique(data, result);

            // filterStack.forEach(function (currentFilter) {
            //     var rest  = filterStack.filter(function (f) { return f.name !== currentFilter.name; }),
            //         found = search(data, rest);


            //     $.each(found, function (i, item) {
            //         $.each(item.values, function (name, value) {
            //             if (result[name].indexOf(value) === -1 && name === currentFilter.name) {
            //                 result[name].push(value);
            //             }
            //         });
            //     });
            // });
            

            $.each(result, function (name) {
                // если есть чем сортировать, то сортируем
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
                $.each(filters[name], function (i, item) {
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

        Filter.prototype.export = function (format) {
            var toCSV = function toCSV (data) {
                return $.map(data, function (item) {
                            var res = [];
                            $.each(item._, function (k, v) {
                                res.push(v);
                            });
                            return res.join(';');
                        }).join('\n');
            };

            switch(format) {
                case 'csv':
                    return toCSV(this.data);
            }
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

                    self.filters = initFilters(fields, found, self.filterStack);

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
