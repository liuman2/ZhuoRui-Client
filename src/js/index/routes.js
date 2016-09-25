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
var codingRouter = require('./router/coding');
var annualRouter = require('./router/annual');
var roleRouter = require('./router/role');
var checkRouter = require('./router/order_check');
var reportRouter = require('./router/report');
var lectureRouter = require('./router/lecture');
var letterRouter = require('./router/letter');
var profileRouter = require('./router/profile');
var messageRouter = require('./router/message');

module.exports = function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('root', {
            abstract: true,
            url: '',
            template: '<div ui-view></div>'
        })
        .state('list', {
            abstract: true,
            template: require('view/common/list/tmpl.html')
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
    codingRouter($stateProvider, $urlRouterProvider);
    annualRouter($stateProvider, $urlRouterProvider);
    roleRouter($stateProvider, $urlRouterProvider);
    checkRouter($stateProvider, $urlRouterProvider);
    reportRouter($stateProvider, $urlRouterProvider);
    lectureRouter($stateProvider, $urlRouterProvider);
    letterRouter($stateProvider, $urlRouterProvider);
    profileRouter($stateProvider, $urlRouterProvider);
    messageRouter($stateProvider, $urlRouterProvider);
};
