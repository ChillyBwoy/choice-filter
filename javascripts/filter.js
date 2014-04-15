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
            });
        }

        function initFilters (fields, data) {
            var result = {};

            // создаём ключи
            // fields.forEach(function () {

            // });
            $.each(fields, function (name) {
                result[name] = [];
            });

            $.each(data, function (i, item) {
                // добавляем в сет только оригинальные значения
                $.each(item.values, function (name, value) {
                    if (result[name].indexOf(value) === -1) {
                        result[name].push(value);
                    }
                });
            });

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

        function filterSearch (fields, data, filters, filterStack) {
            if (filterStack.length === 0) {
                return {'data': data, 'filters': filters};
            }

            var currentFilter = filterStack.shift(),
                results       = $.grep(data, function (item) {
                                    return (item.values[currentFilter.name] ==
                                            currentFilter.value);
                                });
            return filterSearch(fields, results, initFilters(fields, results),
                                filterStack);
        }

        var Filter = function ($nodes, fields, handler) {
            this.$nodes  = $nodes;
            this.fields  = fields;
            this.handler = handler || function() {};

            this.data    = initData(fields, $nodes);
            this.filters = initFilters(fields, this.data);

            this.filterStack = [];

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

                    var filterIsInStack = $.grep(self.filterStack, function (item) {
                        return item.name === name;
                    });

                    if (value) {
                        if (!filterIsInStack.length) {
                            self.filterStack.push({'name': name, 'value': value});
                        }
                    } else {
                        self.filterStack = $.grep(self.filterStack, function (item) {
                            return item.name !== name;
                        });
                    }

                    var slice = Array.prototype.slice;
                    var search = filterSearch(fields, slice.call(self.data, 0),
                                              self.filters,
                                              slice.call(self.filterStack, 0));

                    var elements = $.map(search.data, function (item) {
                                        return item.$[0];
                                    });

                    if (search.filters.length) {
                        self.filters = search.filters;
                    } else {
                        self.filters = initFilters(fields, self.data);
                    }
                    buildNodes(fields, search.filters, self.filterStack);
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
