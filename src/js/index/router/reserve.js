var views_reserve = {
    'info': {
        template: require('view/reserve/info/tmpl.html'),
        controller: require('view/reserve/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('reserve', { // list
            parent: 'list',
            url: '/reserve',
            stateName: '预备客户列表',
            template: require('view/reserve/list/tmpl.html'),
            controller: require('view/reserve/list/ctrl')
        })
        .state('reserve.detail', { // detail
            abstract: true,
            parent: 'detail',
            url: '/reserve',
            template: require('view/reserve/detail/tmpl.html'),
            controller: require('view/reserve/detail/ctrl')
        })
        .state('reserve.detail.add', {
            url: '/new',
            stateName: '新建预备客户',
            views: views_reserve
        })
        .state('reserve.detail.edit', {
            url: '/edit/{id:.*}',
            stateName: '编辑预备客户',
            views: views_reserve
        })
        .state('reserve.detail.view', {
            url: '/view/{id:.*}',
            stateName: '查看预备客户',
            views: views_reserve
        })

        .state('timeline', {
            parent: 'list',
            url: '/view/reserve/timeline/{id:.*}',
            template: require('view/reserve/timeline/tmpl.html'),
            controller: require('view/reserve/timeline/ctrl')
        })
        .state('timeline.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/reserve/timeline/modal.html'),
                    controller: require('view/reserve/timeline/modal')
                }
            }
        })
        .state('timeline.edit', {
            url: '/edit/{tid:.*}',
            views: {
                'add': {
                    template: require('view/reserve/timeline/modal.html'),
                    controller: require('view/reserve/timeline/modal')
                }
            }
        })
};

module.exports = router;
