var views_customer = {
    'info': {
        template: require('view/customer/info/tmpl.html'),
        // controller: require('view/reserve/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('customer', { // list
            parent: 'list',
            url: '/customer',
            stateName: '客户列表',
            template: require('view/customer/list/tmpl.html'),
            // controller: require('view/customer/list/ctrl')
        })
        .state('customer.detail', { // detail
            abstract: true,
            parent: 'detail',
            url: '/customer',
            params: {
                scorm: null
            },
            template: require('view/customer/detail/tmpl.html'),
            controller: require('view/customer/detail/ctrl')
        })        
        .state('customer.detail.add', {
            url: '/new',
            stateName: '新建客户',
            views: views_customer
        })        
        .state('customer.detail.edit', {
            url: '/edit/{id:.*}',
            stateName: '编辑客户',
            views: views_customer
        })     
        .state('customer.detail.view', {
            url: '/view/{id:.*}',
            stateName: '查看客户',
            views: views_customer
        })
        .state('customer_timeline', {
            parent: 'list',
            url: '/view/customer/timeline/{id:.*}',
            template: require('view/customer/timeline/tmpl.html')
        })
        .state('customer_timeline.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/customer/timeline/modal.html')
                }
            }
        })
};

module.exports = router;
