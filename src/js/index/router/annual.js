var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('annual_warning', {
            parent: 'list',
            url: '/annual/warning',
            template: require('view/annual/warnlist/tmpl.html'),
            controller: require('view/annual/warnlist/ctrl')
        })
};

module.exports = router;
