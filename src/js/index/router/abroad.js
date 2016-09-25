var views_abroad = {
    'info': {
        template: require('view/abroad/info/tmpl.html'),
        controller: require('view/abroad/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

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
        .state('abroad_add.bank_add', {
            url: '/progress/bank/{customer_id:.*}',
            views: {
                'bank': {
                    template: require('view/common/bank/modal.html'),
                    controller: require('view/common/bank/modal')
                }
            }
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
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('abroad_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('abroad_view.done', {
            url: '/done/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/orderDone/modal.html'),
                    controller: require('view/common/orderDone/modal')
                }
            }
        })
        .state('abroad_timeline', {
            url: '/view/abroad/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })
        .state('abroad_history', {
            url: '/view/abroad/history/{id:.*}',
            template: require('view/abroad/history/tmpl.html'),
            controller: require('view/abroad/history/ctrl')
        })
        .state('abroad_history.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/abroad/history/modal.html'),
                    controller: require('view/abroad/history/modal')
                }
            }
        })
        .state('abroad_history.edit', {
            url: '/edit',
            views: {
                'add': {
                    template: require('view/abroad/history/modal.html'),
                    controller: require('view/abroad/history/modal')
                }
            }
        })
        .state('abroad.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('abroad.progress.bank_add', {
            url: '/progress/bank/{customer_id:.*}',
            views: {
                'bank': {
                    template: require('view/common/bank/modal.html'),
                    controller: require('view/common/bank/modal')
                }
            }
        })
        .state('abroad_view.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('abroad_view.progress.bank_add', {
            url: '/progress/bank/{customer_id:.*}',
            views: {
                'bank': {
                    template: require('view/common/bank/modal.html'),
                    controller: require('view/common/bank/modal')
                }
            }
        })
        .state('abroad_add.dictionary', {
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
        .state('abroad_edit.dictionary', {
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
