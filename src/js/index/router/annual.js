var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('annual_warning', {
      // parent: 'list',
      url: '/annual/warning',
      template: require('view/annual/warnlist/tmpl.html'),
      controller: require('view/annual/warnlist/ctrl')
    })


  .state('annual', {
      // parent: 'list',
      url: '/annual',
      template: require('view/annual/list/tmpl.html'),
      controller: require('view/annual/list/ctrl')
    })
    .state('annual_add', {
      // parent: 'list',
      url: '/annual/add/{order_type:.*}/{order_id:.*}',
      template: require('view/annual/info/tmpl.html'),
      controller: require('view/annual/info/ctrl')
    })
    .state('annual_edit', {
      url: '/annual/edit/{id:.*}',
      template: require('view/annual/info/tmpl.html'),
      controller: require('view/annual/info/ctrl')
    })
    .state('annual_view', {
      url: '/annual/view/{id:.*}',
      template: require('view/annual/view/tmpl.html'),
      controller: require('view/annual/view/ctrl')
    })
    .state('annual_view.income_add', {
      url: '/new/{source_name:.*}/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('annual_view.income_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('annual_view.audit', {
      url: '/audit/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })
    .state('annual_view.done', {
      url: '/done/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/orderDone/modal.html'),
          controller: require('view/common/orderDone/modal')
        }
      }
    })
    .state('annual_view.receipt', {
      url: '/annual/receipt/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
    .state('annual_timeline', {
      url: '/view/annual/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('annual.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('annual_view.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('annual_add.dictionary', {
      url: '/dictionary',
      params: {
        group: null
      },
      views: {
        'modal': {
          template: require('view/common/dictionary/modal.html'),
          controller: require('view/common/dictionary/modal')
        }
      }
    })
    .state('annual_edit.dictionary', {
      url: '/dictionary',
      params: {
        group: null
      },
      views: {
        'modal': {
          template: require('view/common/dictionary/modal.html'),
          controller: require('view/common/dictionary/modal')
        }
      }
    })
};

module.exports = router;
