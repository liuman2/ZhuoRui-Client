module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('organization', {
            url: '/organization',
            template: require('view/organization/tmpl.html'),
            controller: require('view/organization/ctrl')
        })
};
