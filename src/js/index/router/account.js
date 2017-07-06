var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('account', { // list
      parent: 'list',
      url: '/account',
      stateName: '国内代账列表',
      template: require('view/account/list/tmpl.html'),
      controller: require('view/account/list/ctrl')
    })
    .state('account_add', {
      parent: 'list',
      url: '/account/add',
      template: require('view/account/info/tmpl.html'),
      controller: require('view/account/info/ctrl')
    })
    .state('account_edit', {
      parent: 'list',
      url: '/account/edit/{id:.*}',
      template: require('view/account/info/tmpl.html'),
      controller: require('view/account/info/ctrl')
    })

    .state('account_add.source', {
      params: {
        customer_id: null
      },
      views: {
        'source': {
          template: require('view/account/info/source.html'),
          controller: require('view/account/info/source')
        }
      }
    })
    .state('account_add.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('account_view', {
      url: '/account/view/{id:.*}',
      template: require('view/account/view/tmpl.html'),
      controller: require('view/account/view/ctrl')
    })
    .state('account_view.income_add', {
      url: '/new/{source_name:.*}/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('account_view.income_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('account_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })
    .state('account_view.addsub', {
      url: '/sub/add',
      views: {
        'sub': {
          template: require('view/account/view/sub.html'),
          controller: require('view/account/view/sub')
        }
      }
    })
    .state('account_view.editsub', {
      url: '/sub/edit/{sub_id:.*}',
      views: {
        'sub': {
          template: require('view/account/view/sub.html'),
          controller: require('view/account/view/sub')
        }
      }
    })
    .state('account_view.pass', {
      url: '/account/{module_name:.*}/{subId:.*}/{period:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/pass.html'),
          controller: require('view/common/audit/pass')
        }
      }
    })
    .state('account_view.audit', {
      url: '/account/{module_name:.*}/{subId:.*}/{period:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })

    .state('account_view.progress_add', {
      url: '/new/{item_id:.*}',
      views: {
        'progress': {
          template: require('view/account/view/progress.html'),
          controller: require('view/account/view/progress')
        }
      }
    })
    .state('account_view.progress_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'progress': {
          template: require('view/account/view/progress.html'),
          controller: require('view/account/view/progress')
        }
      }
    })
    .state('account_timeline', {
      url: '/view/account/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('account_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('account_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })

    .state('account_view.receipt', {
      url: '/account/receipt/{type:.*}/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
};

module.exports = router;
