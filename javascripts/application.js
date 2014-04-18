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
        return a < b ? 1 : -1;
    };

    var sortDesc = function sortDesc (a, b) {
        return a < b ? -1 : 1;
    };

    $(function() {

        var onFilter = function onFilter(filters, found, allElements, reset) {
            $('#logger').text('Found: ' + found.length);

            if (reset) {
                allElements.show();
            } else {
                allElements.hide();
                found.show();
            }
        };

        var filter = new DataFilter($('#container li'), {
            'registered': {'$': $('#filter_registered'), 'formatter': formatDate , 'sorter': sortDate},
            'gender':     {'$': $('#filter_gender')},
            'age':        {'$': $('#filter_age'), 'sorter': sortDesc},
            'os':         {'$': $('#filter_os')},
            'mobile':     {'$': $('#filter_mobile')},
            'fruit':      {'$': $('#filter_fruit'), 'formatter': $.trim, 'sorter': sortAsc},
            'color':      {'$': $('#filter_color')},
            'active':     {'$': $('#filter_active'), 'formatter': formatActive},
        }, onFilter);


    });


}(window.jQuery));
