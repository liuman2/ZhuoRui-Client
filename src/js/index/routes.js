var dashboardRouter = require('./router/dashboard');
var reserveRouter = require('./router/reserve');
var customerRouter = require('./router/customer');
var abroadRouter = require('./router/abroad');
var organizationRouter = require('./router/organization');
var areaRouter = require('./router/area');
var positionRouter = require('./router/position');
var memberRouter = require('./router/member');
var dictionaryRouter = require('./router/dictionary');
var internalRouter = require('./router/internal');
var auditRouter = require('./router/audit');
var trademarkRouter = require('./router/trademark');
var patentRouter = require('./router/patent');

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
    organizationRouter($stateProvider, $urlRouterProvider);
    areaRouter($stateProvider, $urlRouterProvider);
    positionRouter($stateProvider, $urlRouterProvider);
    memberRouter($stateProvider, $urlRouterProvider);
    dictionaryRouter($stateProvider, $urlRouterProvider);
    internalRouter($stateProvider, $urlRouterProvider);
    auditRouter($stateProvider, $urlRouterProvider);
    trademarkRouter($stateProvider, $urlRouterProvider);
    patentRouter($stateProvider, $urlRouterProvider);
};
