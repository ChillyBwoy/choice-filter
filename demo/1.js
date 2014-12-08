(function ($) {
    'use strict';

    $(function () {

        function buildNodes () {
            var ul = $('#container');
            $.each(window.testData, function(i, item) {
                var li = $('<li/>');
                li.css({'background-color': item.color});
                $.each(item, function (key, value) {
                    li.append($('<p/>').text(key + ': ' + value));
                    li.attr('data-' + key, value);
                });
                ul.append(li);
            });
        }
        buildNodes();

        
        var parseDate = function parseDate (value) {
            return new Date(Date.parse(value.slice(0, 3) + ' 1, ' + value.slice(5)));
        };

        // format functions 
        var formatDate = function formatDate (value) {
            var date  = new Date(Date.parse(value)),
                names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return [names[date.getMonth()], date.getFullYear()].join(', ');
        };

        var formatActive = function formatActive (value) {
            return ('' + value) === 'true' ? 'Yes' : 'No';
        };

        // sort functions 
        var sortDate = function sortDate (a, b) {
            return parseDate(a) > parseDate(b) ? 1 : -1;
        };

        var sortAsc = function sortAsc (a, b) {
            return a < b ? -1 : 1;
        };

        var sortDesc = function sortDesc (a, b) {
            return a < b ? 1 : -1;
        };


        var inputs = {
                'registered': $('#filter_registered'),
                'gender':     $('#filter_gender'),
                'age':        $('#filter_age'),
                'os':         $('#filter_os'),
                'mobile':     $('#filter_mobile'),
                'state':      $('#filter_state'),
                'fruit':      $('#filter_fruit'),
                'color':      $('#filter_color'),
                'active':     $('#filter_active'),
            },
            fields = {
                'registered': {'formatter': formatDate, 'sorter': sortDate},
                'gender':     {},
                'age':        {'sorter': sortDesc},
                'os':         {},
                'mobile':     {},
                'state':      {'sorter': sortDesc},
                'fruit':      {'formatter': $.trim, 'sorter': sortAsc},
                'color':      {},
                'active':     {'formatter': formatActive}
            };

        var $nodes  = $('#container li'),
            filters = DataFilter.initFilters(fields),
            data    = DataFilter.$DOM2Data(fields, $nodes);

        function bindSelects () {
            $.each(inputs, function (name, input) {
                input.on('change', function (event) {
                    event.preventDefault();
                    var value = input.val();
                    if (value) {
                        filters[name] = value;
                    } else {
                        filters[name] = null;
                    }
                    DataFilter.filter(data, filters, fields, filterHandler);
                });
            });
        }

        function optionTag (value, label) {
            return $('<option/>').attr('value', value).text(label);
        }

        function fillSelect (select, values) {
            select.text('');
            select.append(optionTag('', '---'));

            values.forEach(function (item) {
                select.append(optionTag(item, item));
            });
        }

        function filterHandler(found, choices, filters) {
            $('#logger').text('Found: ' + found.length);
            $nodes.hide();

            var $foundNodes = found.map(function (item) { return item.$; });
            $($foundNodes).show();

            $.each(choices, function (name, values) {
                fillSelect(inputs[name], values);
            });

            $.each(filters, function (name, item) {
                var node = inputs[name];
                node.val(item);
            });
        }

        bindSelects();
        DataFilter.filter(data, filters, fields, filterHandler);
    });

}(window.jQuery));
