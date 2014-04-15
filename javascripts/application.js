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


    // возвращаем строку без пробелов по краям
    var formatFruit = function formatFruit (value) {
        return $.trim(value);
    };

    var formatDate = function formatDate (value) {
        var date  = new Date(Date.parse(value)),
            names = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
        return [names[date.getMonth()], date.getFullYear()].join(' ');
    };

    var formatActive = function formatActive (value) {
        return ('' + value) === 'true' ? 'Да' : 'Нет';
    };

    var sortStringAsc = function sortStringAsc (a, b) {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    };

    var sortDateAsc = function sortDateAsc (a, b) {
        if (a < b) {
            return 1;
        } else {
            return -1;
        }
    };

    $(function() {
        var onFilter = function onFilter(filters, found, allElements, reset) {

            var query = $.map(filters, function (item) {
                return item.name + ': ' + item.value;
            }).join(', ');

            console.log('%s; Found: %s.', query, found.length);

            if (reset) {
                allElements.show();
            } else {
                allElements.hide();
                found.show();                
            }
        };

        $('#container li').Filter({
            'registered': {'$': $('#filter_registered'), 'formatter': formatDate , 'sorter': sortDateAsc},
            'gender':     {'$': $('#filter_gender')},
            'age':        {'$': $('#filter_age')},
            'os':         {'$': $('#filter_os')},
            'mobile':     {'$': $('#filter_mobile')},
            // 'name':       {'$': $('#filter_name'), 'sorter': sortStringAsc},
            'fruit':      {'$': $('#filter_fruit'), 'formatter': formatFruit, 'sorter': sortStringAsc},
            'color':      {'$': $('#filter_color')},
            'active':     {'$': $('#filter_active'), 'formatter': formatActive},
        }, onFilter);
    });


}(window.jQuery));
