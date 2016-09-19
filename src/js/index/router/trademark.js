var views_trademark = {
    'info': {
        template: require('view/trademark/info/tmpl.html'),
        controller: require('view/trademark/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('trademark', {
            parent: 'list',
            url: '/trademark',
            template: require('view/trademark/list/tmpl.html'),
            controller: require('view/trademark/list/ctrl')
        })
        .state('trademark_add', {
            parent: 'list',
            url: '/trademark/add',
            template: require('view/trademark/info/tmpl.html'),
            controller: require('view/trademark/info/ctrl')
        })
        .state('trademark_edit', {
            url: '/trademark/edit/{id:.*}',
            template: require('view/trademark/info/tmpl.html'),
            controller: require('view/trademark/info/ctrl')
        })
        .state('trademark_view', {
            url: '/trademark/view/{id:.*}',
            template: require('view/trademark/view/tmpl.html'),
            controller: require('view/trademark/view/ctrl')
        })
        .state('trademark_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('trademark_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('trademark_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('trademark_view.done', {
            url: '/done/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/orderDone/modal.html'),
                    controller: require('view/common/orderDone/modal')
                }
            }
        })
        .state('trademark_timeline', {
            url: '/view/trademark/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })

        .state('trademark.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('trademark_view.progress', {
            url: '/progress/{id:.*}/{module_name:.*}',
            views: {
                'progress': {
                    template: require('view/common/progress/modal.html'),
                    controller: require('view/common/progress/modal')
                }
            }
        })
        .state('trademark_add.dictionary', {
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
        .state('trademark_edit.dictionary', {
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
