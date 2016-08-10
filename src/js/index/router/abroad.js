var views_abroad = {
    'info': {
        template: require('view/abroad/info/tmpl.html'),
        controller: require('view/abroad/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('abroad', {
            parent: 'list',
            url: '/abroad',
            template: require('view/abroad/list/tmpl.html'),
            controller: require('view/abroad/list/ctrl')
        })
        .state('abroad_add', {
            parent: 'list',
            url: '/abroad/add',
            template: require('view/abroad/info/tmpl.html'),
            controller: require('view/abroad/info/ctrl')
        })
        .state('abroad_edit', {
            url: '/abroad/edit/{id:.*}',
            template: require('view/abroad/info/tmpl.html'),
            controller: require('view/abroad/info/ctrl')
        })
        .state('abroad_view', {
            url: '/abroad/view/{id:.*}',
            template: require('view/abroad/view/tmpl.html'),
            controller: require('view/abroad/view/ctrl')
        })

        .state('abroad_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('abroad_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/customer/view/modal.html'),
                    controller: require('view/customer/view/modal')
                }
            }
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
