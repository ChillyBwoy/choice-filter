(function ($) {
    'use strict';

    $(function() {
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

        var filters, data;

        var fields = {
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


        function buildP(key, value) {
            var p = $('<p/>'),
                s = $('<span/>').text(key + ': ');

            if (fields.hasOwnProperty(key)) {
                var a = $('<a/>').attr('href', '#')
                                 .attr('data-key-name', key)
                                 .attr('data-key-value', value)
                                 .text(value);
                a.click(function (event) {
                    event.preventDefault();
                    var node  = $(this),
                        name  = node.data('key-name'),
                        value = node.data('key-value');

                    if (fields[name].formatter) {
                        value = fields[name].formatter(value);
                    }

                    filters[name] = value;
                    DataFilter.filter(data, filters, fields, filterHandler);
                    
                });
                return p.append(s).append(a);
            } else {
                return p.append(s).append($('<em/>').text(value));
            }
        }

        function buildNodes () {
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
        }

        buildNodes();

        var $nodes  = $('#container li');

        filters = DataFilter.initFilters(fields);
        data    = DataFilter.$DOM2Data(fields, $nodes);


        function filterHandler(found, choices, filters) {
            $nodes.hide();
            var $foundNodes = found.map(function (item) { return item.$; });
            $($foundNodes).show();

            $('#logger').text('');
            $.each(filters, function (key, value) {
                $('#logger').append($('<p/>').text(key + ': ' + (value ? value : '---')));
            });
            
        };

        DataFilter.filter(data, filters, fields, filterHandler);
    });

}(window.jQuery));
