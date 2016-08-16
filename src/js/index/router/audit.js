var views_audit = {
    'info': {
        template: require('view/audit/info/tmpl.html'),
        controller: require('view/audit/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('audit', {
            parent: 'list',
            url: '/audit',
            template: require('view/audit/list/tmpl.html'),
            controller: require('view/audit/list/ctrl')
        })
        .state('audit_add', {
            parent: 'list',
            url: '/audit/add',
            template: require('view/audit/info/tmpl.html'),
            controller: require('view/audit/info/ctrl')
        })
        .state('audit_edit', {
            url: '/audit/edit/{id:.*}',
            template: require('view/audit/info/tmpl.html'),
            controller: require('view/audit/info/ctrl')
        })
        .state('audit_view', {
            url: '/audit/view/{id:.*}',
            template: require('view/audit/view/tmpl.html'),
            controller: require('view/audit/view/ctrl')
        })
        .state('audit_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('audit_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('audit_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('audit_view.done', {
            url: '/done/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/orderDone/modal.html'),
                    controller: require('view/common/orderDone/modal')
                }
            }
        })
        .state('audit_timeline', {
            url: '/view/audit/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })
        .state('audit_history', {
            url: '/view/audit/history/{id:.*}',
            template: require('view/audit/history/tmpl.html'),
            controller: require('view/audit/history/ctrl')
        })
        .state('audit_history.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/audit/history/modal.html'),
                    controller: require('view/audit/history/modal')
                }
            }
        })

        .state('audit.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('audit_view.progress', {
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
