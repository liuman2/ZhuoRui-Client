module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('order_summary', {
            url: '/report/summary',
            template: require('view/report/summary/tmpl.html'),
            controller: require('view/report/summary/ctrl')
        })
};
