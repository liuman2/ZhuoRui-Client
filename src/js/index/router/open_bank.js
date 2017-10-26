
var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('open_bank', { // list
      parent: 'list',
      url: '/openbank',
      stateName: '银行列表',
      template: require('view/openbank/list/tmpl.html'),
      controller: require('view/openbank/list/ctrl')
    })
    .state('bank_add', {
      parent: 'list',
      url: '/bank/add',
      template: require('view/openbank/info/tmpl.html'),
      controller: require('view/openbank/info/ctrl')
    })
    .state('bank_view', {
      url: '/bank/view/{id:.*}',
      stateName: '查看银行',
      template: require('view/bank/view/tmpl.html'),
      controller: require('view/bank/view/ctrl')
    })
    .state('bank_edit', {
      url: '/bank/edit/{id:.*}',
      stateName: '编辑银行',
      template: require('view/bank/info/tmpl.html'),
      controller: require('view/bank/info/ctrl')
    })
};

module.exports = router;
