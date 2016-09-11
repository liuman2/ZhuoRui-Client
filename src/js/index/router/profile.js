var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('profile', {
            url: '/profile',
            template: require('view/profile/tmpl.html'),
            controller: require('view/profile/ctrl')
        })
};

module.exports = router;
