var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            stateName: '我的桌面',
            template: require('view/dashboard/tmpl.html'),
            controller: require('view/dashboard/ctrl')
        })
};

module.exports = router;
