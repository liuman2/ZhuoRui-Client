module.exports = function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/signin');

    $stateProvider
        .state('signin', {
            url: '/signin',
            template: require('view/signin/tmpl.html'),
            controller: require('view/signin/ctrl')
        })
};
