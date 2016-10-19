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
        .state('history', {
            url: '/history/list/{module_id:.*}/{code:.*}/{source_id:.*}',
            template: require('view/history/list.html'),
            controller: require('view/history/list')
        })
        .state('history_add', {
            url: '/history/add/{module_id:.*}/{code:.*}/{source_id:.*}',
            template: require('view/history/info.html'),
            controller: require('view/history/info')
        })
        .state('history_view', {
            url: '/history/view/{id:.*}',
            template: require('view/history/view.html'),
            controller: require('view/history/view')
        })
        .state('history_view.income_add', {
            url: '/new/{source_name:.*}/{customer_id:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('history_view.income_edit', {
            url: '/edit/{tid:.*}',
            views: {
                'modal': {
                    template: require('view/common/income/modal.html'),
                    controller: require('view/common/income/modal')
                }
            }
        })
        .state('history_view.audit', {
            url: '/audit/{module_name:.*}',
            views: {
                'modal': {
                    template: require('view/common/audit/modal.html'),
                    controller: require('view/common/audit/modal')
                }
            }
        })
        .state('history_timeline', {
            url: '/view/history/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
            template: require('view/common/timeline/tmpl.html'),
            controller: require('view/common/timeline/ctrl')
        })
        .state('history_edit', {
            url: '/history/edit/{module_id:.*}/{code:.*}/{source_id:.*}/{id:.*}',
            template: require('view/history/info.html'),
            controller: require('view/history/info')
        })
        .state('bank', {
          url: '/bank',
          template: require('view/bank/tmpl.html'),
          controller: require('view/bank/ctrl')
        })
        .state('bank.bank_add', {
            url: '/bank/add',
            views: {
                'modal': {
                    template: require('view/bank/modal.html'),
                    controller: require('view/bank/modal')
                }
            }
        })
        .state('bank.bank_edit', {
            url: '/bank/edit/{id:.*}',
            views: {
                'modal': {
                    template: require('view/bank/modal.html'),
                    controller: require('view/bank/modal')
                }
            }
        })
        .state('attendance_bill', {
            url: '/attendance/bill',
            template: require('view/attendance/bill/tmpl.html'),
            controller: require('view/attendance/bill/ctrl')
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
