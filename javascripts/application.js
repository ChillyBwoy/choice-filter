(function ($) {
    'use strict';

    function buildP(key, value) {
        return $('<p/>').text(key + ': ' + value);
    }

    var ul = $('#container');
    $.each(window.testData, function(i, item) {
        var li = $('<li/>');
        li.css({'background-color': item.color});
        $.each(item, function (key, value) {
            li.append(buildP(key, value));
            li.attr('data-' + key, value);
        });
        ul.append(li);
    });


    var formatDate = function formatDate (value) {
        var date  = new Date(Date.parse(value)),
            names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return [names[date.getMonth()], date.getFullYear()].join(', ');
    };

    var parseDate = function parseDate (value) {
        return new Date(Date.parse(value.slice(0, 3) + ' 1, ' + value.slice(5)));
    };

    var formatActive = function formatActive (value) {
        return ('' + value) === 'true' ? 'Yes' : 'No';
    };

    var sortDate = function sortDate (a, b) {
        return parseDate(a) > parseDate(b) ? 1 : -1;
    };

    var sortAsc = function sortAsc (a, b) {
        return a < b ? -1 : 1;
    };

    var sortDesc = function sortDesc (a, b) {
        return a < b ? 1 : -1;
    };


    $(function() {

        var inputs = {
                'registered': $('#filter_registered'),
                'gender':     $('#filter_gender'),
                'age':        $('#filter_age'),
                'os':         $('#filter_os'),
                'mobile':     $('#filter_mobile'),
                'fruit':      $('#filter_fruit'),
                'color':      $('#filter_color'),
                'active':     $('#filter_active')
            },
            fields = {
                'registered': {'formatter': formatDate, 'sorter': sortDate},
                'gender':     {},
                'age':        {'sorter': sortDesc},
                'os':         {},
                'mobile':     {},
                'fruit':      {'formatter': $.trim, 'sorter': sortAsc},
                'color':      {},
                'active':     {'formatter': formatActive}
            },
            $nodes  = document.querySelectorAll('#container li'),
            filters = DataFilter.initFilters(fields),
            data    = DataFilter.$DOM2Data(fields, $nodes);


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

        function filterHandler(found, choices, filters) {
            $('#container li').hide();
            $('#logger').text('Found: ' + found.length);

            $nodes = found.map(function (item) { return item.$; });
            $($nodes).show();

            var optionTag = function (value, label) {
                return $('<option/>').attr('value', value).text(label);
            };

            $.each(choices, function (name, values) {
                var node       = inputs[name],
                    emptyLabel = node.data('filter-emptylabel');

                node.text('');
                node.append(optionTag('', emptyLabel));

                values.forEach(function (item) {
                    node.append(optionTag(item, item));
                });
            });

            $.each(filters, function (name, item) {
                var node = inputs[name];
                node.val(item);
            });
        };

        DataFilter.filter(data, filters, fields, filterHandler);
    });


}(window.jQuery));
