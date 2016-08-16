var views_internal = {
    'info': {
        template: require('view/internal/info/tmpl.html'),
        controller: require('view/internal/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('internal', {
            parent: 'list',
            url: '/internal',
            template: require('view/internal/list/tmpl.html'),
            controller: require('view/internal/list/ctrl')
        })
        .state('internal_add', {
            parent: 'list',
            url: '/internal/add',
            template: require('view/internal/info/tmpl.html'),
            controller: require('view/internal/info/ctrl')
        })
        .state('internal_edit', {
            url: '/internal/edit/{id:.*}',
            template: require('view/internal/info/tmpl.html'),
            controller: require('view/internal/info/ctrl')
        })
        .state('internal_view', {
            url: '/internal/view/{id:.*}',
            template: require('view/internal/view/tmpl.html'),
            controller: require('view/internal/view/ctrl')
        })
        .state('internal_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('internal_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('internal_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('internal_view.done', {
            url: '/done/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/orderDone/modal.html'),
                    controller: require('view/common/orderDone/modal')
                }
            }
        })
        .state('internal_timeline', {
            url: '/view/internal/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })
        .state('internal_history', {
            url: '/view/internal/history/{id:.*}',
            template: require('view/internal/history/tmpl.html'),
            controller: require('view/internal/history/ctrl')
        })
        .state('internal_history.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/internal/history/modal.html'),
                    controller: require('view/internal/history/modal')
                }
            }
        })

        .state('internal.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('internal_view.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
};

module.exports = router;
