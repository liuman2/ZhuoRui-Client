
var router = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('supplier', { // list
            parent: 'list',
            url: '/supplier',
            stateName: '供应商列表',
            template: require('view/supplier/list/tmpl.html'),
            controller: require('view/supplier/list/ctrl')
        })
        .state('supplier.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/supplier/list/modal.html'),
                    controller: require('view/supplier/list/modal')
                }
            }
        })
};

module.exports = router;
