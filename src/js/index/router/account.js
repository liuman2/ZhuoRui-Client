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
};

module.exports = router;
