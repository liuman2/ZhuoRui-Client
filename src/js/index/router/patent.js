var views_patent = {
    'info': {
        template: require('view/patent/info/tmpl.html'),
        controller: require('view/patent/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('patent', {
            parent: 'list',
            url: '/patent',
            template: require('view/patent/list/tmpl.html'),
            controller: require('view/patent/list/ctrl')
        })
        .state('patent_add', {
            parent: 'list',
            url: '/patent/add',
            template: require('view/patent/info/tmpl.html'),
            controller: require('view/patent/info/ctrl')
        })
        .state('patent_edit', {
            url: '/patent/edit/{id:.*}',
            template: require('view/patent/info/tmpl.html'),
            controller: require('view/patent/info/ctrl')
        })
        .state('patent_view', {
            url: '/patent/view/{id:.*}',
            template: require('view/patent/view/tmpl.html'),
            controller: require('view/patent/view/ctrl')
        })
        .state('patent_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('patent_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('patent_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('patent_view.done', {
            url: '/done/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/orderDone/modal.html'),
                    controller: require('view/common/orderDone/modal')
                }
            }
        })
        .state('patent_timeline', {
            url: '/view/patent/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })
};

module.exports = router;
