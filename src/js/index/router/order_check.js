module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('check_finance', {
            url: '/check/finance',
            template: require('view/check/finance/tmpl.html'),
            controller: require('view/check/finance/ctrl')
        })
        .state('check_submit', {
            url: '/check/submit',
            template: require('view/check/submit/tmpl.html'),
            controller: require('view/check/submit/ctrl')
        })
};
