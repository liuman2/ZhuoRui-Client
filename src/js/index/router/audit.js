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
        .state('audit_add.source', {
            // url: '/audit/add/source',
            params: {
                customer_id: null,
                type: null
            },
            views: {
                'source': {
                    template: require('view/audit/info/source.html'),
                    controller: require('view/audit/info/source')
                }
            }
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

        .state('audit_view.bank_add', {
            url: '/bank/{customer_id: .*}/{audit_id: .*}',
            views: {
                'modal': {
                    template: require('view/audit/view/bank_add.html'),
                    controller: require('view/audit/view/bank_add')
                }
            }
        })
        .state('audit_view.bank_select', {
            url: '/bank/{customer_id: .*}/{audit_id: .*}',
            views: {
                'bank': {
                    template: require('view/audit/view/bank_select.html'),
                    controller: require('view/audit/view/bank_select')
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
        .state('audit_add.dictionary', {
            url: '/dictionary',
            params: {
                group: null
            },
            views: {
                'modal': {
                    template: require('view/common/dictionary/modal.html'),
                    controller: require('view/common/dictionary/modal')
                }
            }
        })
        .state('audit_edit.dictionary', {
            url: '/dictionary',
            params: {
                group: null
            },
            views: {
                'modal': {
                    template: require('view/common/dictionary/modal.html'),
                    controller: require('view/common/dictionary/modal')
                }
            }
        })
};

module.exports = router;
