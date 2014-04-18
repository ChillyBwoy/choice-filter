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

        var onFilter = function onFilter(found, filters, reset) {

            // var elements = $.map(found, function (item) { return item.$; });
            console.log(found)

            $('#logger').text('Found: ' + found.length);

            // if (reset) {
            //     allElements.show();
            // } else {
            //     allElements.hide();
            //     elements.show();
            // }
        };
        // console.log();

        
        var filter = new DataFilter(document.querySelectorAll('#container li'), {
            'registered': {'formatter': formatDate , 'sorter': sortDate},
            'gender':     {},
            'age':        {'sorter': sortDesc},
            'os':         {},
            'mobile':     {},
            'fruit':      {'formatter': $.trim, 'sorter': sortAsc},
            'color':      {},
            'active':     {'formatter': formatActive},
        }, onFilter);


    });


}(window.jQuery));
