module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('coding', {
            url: '/settings/coding',
            template: require('view/settings/coding/tmpl.html'),
            // controller: require('view/settings/coding/ctrl')
        })
};
