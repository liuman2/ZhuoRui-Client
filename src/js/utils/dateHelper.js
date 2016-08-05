function timeChange(source, inFormat, outFormat) {
    var checkTime = function(time) {
        if (time < 10) {
            time = "0" + time;
        };
        return time;
    };
    switch (inFormat) {
        case 'Y-m-d H:i:s':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4], source[5], source[6], source[7]);
            break;
        case 'Y-m-d H:i':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4], source[5], source[6]);
            break;
        case 'Y-m-d':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4]);
            break;
        case 'timestamp':
            source = new Date(parseInt(source) * 1000);
            break;
    };
    switch (outFormat) {
        case 'Y-m-d H:i:s':
            return source.getFullYear() + '-' + checkTime(source.getMonth() + 1) + '-' + checkTime(source.getDate()) + ' ' + checkTime(source.getHours()) + ':' + checkTime(source.getMinutes()) + ':' + checkTime(source.getSeconds());
        case 'Y年m月d日 H:i':
            return source.getFullYear() + '年' + checkTime(source.getMonth() + 1) + '月' + checkTime(source.getDate()) + '日 ' + checkTime(source.getHours()) + ':' + checkTime(source.getMinutes());
        case 'Y-m-d':
            return source.getFullYear() + '-' + checkTime(source.getMonth() + 1) + '-' + checkTime(source.getDate());
        case 'Y.m.d':
            return source.getFullYear() + '.' + checkTime(source.getMonth() + 1) + '.' + checkTime(source.getDate());
        case 'timestamp':
            return parseInt(source.getTime() / 1000);
        case 'newDate':
            return source;
    };
}

module.exports = exports = timeChange;
