var views_abroad = {
    'info': {
        template: require('view/abroad/info/tmpl.html'),
        controller: require('view/abroad/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('abroad', { // list
            parent: 'list',
            url: '/abroad',
            stateName: '境外注册业务列表',
            template: require('view/abroad/list/tmpl.html'),
            controller: require('view/abroad/list/ctrl')
        })
        .state('abroad.detail', { // detail
            abstract: true,
            parent: 'detail',
            url: '/abroad',
            params: {
                scorm: null
            },
            template: require('view/abroad/detail/tmpl.html'),
            controller: require('view/abroad/detail/ctrl')
        })
        .state('abroad.detail.add', {
            url: '/new',
            stateName: '新建境外注册业务',
            views: views_abroad
        })
        .state('abroad.detail.edit', {
            url: '/edit/{id:.*}',
            stateName: '编辑境外注册业务',
            views: views_abroad
        })
        // .state('abroad.detail.view', {
        //     url: '/view/{id:.*}',
        //     stateName: '查看境外注册业务',
        //     template: require('view/abroad/view/tmpl.html')
        // })
        .state('abroad_view', {
            url: '/abroad/view/{id:.*}',
            stateName: '查看境外注册业务',
            template: require('view/abroad/view/tmpl.html')
        })

        .state('abroad_timeline', {
            parent: 'list',
            url: '/view/abroad/timeline/{id:.*}',
            template: require('view/abroad/timeline/tmpl.html')
        })
        .state('abroad_timeline.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/abroad/timeline/modal.html')
                }
            }
        })
};

module.exports = router;
