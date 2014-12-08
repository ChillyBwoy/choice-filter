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

        function choiceTag (key, value, label) {
            var a = $('<a/>').text(label)
                             .attr('href', '#')
                             .attr('data-key-name', key)
                             .attr('data-key-value', value),
                li = $('<li/>');

            if (value == filters[key]) {
                li.addClass('selected');
            }

            a.click(function (event) {
                event.preventDefault();
                var node  = $(this),
                    name  = node.data('key-name'),
                    value = node.data('key-value');
                if (!value) {
                    value = null;
                }
                filters[name] = value;
                DataFilter.filter(data, filters, fields, filterHandler);
            });
            return li.append(a);
        }

        function fillUl (name, ul, values) {
            ul.text('');
            ul.append(choiceTag(name, '', '---'));

            values.forEach(function (item) {
                ul.append(choiceTag(name, item, item));
            });
        }

        function filterHandler(found, choices, filters) {
            $nodes.hide();

            var $foundNodes = found.map(function (item) { return item.$; });
            $($foundNodes).show();

            $('#logger').text('');
            $.each(filters, function (key, value) {
                $('#logger').append($('<span>' + key + '</span>: <strong>' + (value ? value : '---') + '</strong>'));
            });

            $.each(choices, function (name, values) {
                fillUl(name, inputs[name], values);
            });
        }

        
        DataFilter.filter(data, filters, fields, filterHandler);
    });

}(window.jQuery));