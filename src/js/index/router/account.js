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
};

module.exports = router;
