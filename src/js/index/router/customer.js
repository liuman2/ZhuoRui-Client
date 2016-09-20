var views_customer = {
    'info': {
        template: require('view/customer/info/tmpl.html'),
        controller: require('view/customer/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('customer', { // list
            parent: 'list',
            url: '/customer',
            stateName: '客户列表',
            template: require('view/customer/list/tmpl.html'),
            controller: require('view/customer/list/ctrl')
        })
        .state('customer_add', {
            parent: 'list',
            url: '/customer/add',
            template: require('view/customer/info/tmpl.html'),
            controller: require('view/customer/info/ctrl')
        })
        .state('customer_edit', {
            url: '/customer/edit/{id:.*}',
            stateName: '编辑客户',
            template: require('view/customer/info/tmpl.html'),
            controller: require('view/customer/info/ctrl')
        })
        .state('customer_view', {
            url: '/customer/view/{id:.*}',
            stateName: '查看客户',
            template: require('view/customer/view/tmpl.html'),
            controller: require('view/customer/view/ctrl')
        })
        .state('customer_view.bank_add', {
            url: '/new',
            views: {
                'modal': {
                    template: require('view/customer/view/modal.html'),
                    controller: require('view/customer/view/modal')
                }
            }
        })
        .state('customer_view.bank_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/customer/view/modal.html'),
                    controller: require('view/customer/view/modal')
                }
            }
        })
        .state('customer_timeline', {
            parent: 'list',
            url: '/view/customer/timeline/{id:.*}',
            template: require('view/customer/timeline/tmpl.html'),
            controller: require('view/customer/timeline/ctrl')
        })
        .state('customer_timeline.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/customer/timeline/modal.html'),
                    controller: require('view/customer/timeline/modal')
                }
            }
        })
        .state('customer_timeline.edit', {
            url: '/edit/{tid:.*}',
            views: {
                'add': {
                    template: require('view/customer/timeline/modal.html'),
                    controller: require('view/customer/timeline/modal')
                }
            }
        })

        .state('customer_add.dictionary', {
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
        .state('customer_edit.dictionary', {
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
