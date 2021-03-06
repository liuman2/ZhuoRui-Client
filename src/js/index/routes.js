var dashboardRouter = require('./router/dashboard');
var reserveRouter = require('./router/reserve');
var customerRouter = require('./router/customer');
var abroadRouter = require('./router/abroad');

module.exports = function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('root', {
            abstract: true,
            url: '',
            template: '<div ui-view></div>'
        })

    //--- template -------------------------------------

    // layout - list
    .state('list', {
            abstract: true,
            template: require('view/common/list/tmpl.html'),
            // controller: require('view/common/list/ctrl')
        })
        .state('detail', {
            abstract: true,
            template: require('view/common/detail/tmpl.html')
        })

    dashboardRouter($stateProvider, $urlRouterProvider);
    reserveRouter($stateProvider, $urlRouterProvider);
    customerRouter($stateProvider, $urlRouterProvider);
    abroadRouter($stateProvider, $urlRouterProvider);
};
