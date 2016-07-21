var Nav = {
    'customer_manage': {
        name: '客户管理',
        nav: [
            { route: 'reserve', name: '预备客户' },
            { route: 'offical', name: '正式客户' }
        ]
    }
};


var map = {};
for (var i in Nav) {
    for (var j in Nav[i].nav) {
        map[Nav[i].nav[j].route] = {
            id: i,
            name: Nav[i].name
        };
    }
}

module.exports = exports = Nav;
exports.map = map;
