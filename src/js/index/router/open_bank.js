
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
      template: require('view/openbank/view/tmpl.html'),
      controller: require('view/openbank/view/ctrl')
    })
    .state('bank_edit', {
      url: '/bank/edit/{id:.*}',
      stateName: '编辑银行',
      template: require('view/openbank/info/tmpl.html'),
      controller: require('view/openbank/info/ctrl')
    })
    .state('bank_add.contact_add', {
      url: '/bank/new/contact',
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/openbank/info/modal.html'),
          controller: require('view/openbank/info/modal')
        }
      }
    })
    .state('bank_add.contact_edit', {
      url: '/bank/edit/contact/{index:.*}',
      params: {
        index: null,
        contactId: null,
        name: null,
        tel: null,
        email: null,
        memo: null,
      },
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/openbank/info/modal.html'),
          controller: require('view/openbank/info/modal')
        }
      }
    })
    .state('bank_edit.contact_edit', {
      url: '/bank/edit/contact/{index:.*}',
      params: {
        index: null,
        contactId: null,
        name: null,
        tel: null,
        email: null,
        memo: null,
      },
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/openbank/info/modal.html'),
          controller: require('view/openbank/info/modal')
        }
      }
    })
    .state('bank_edit.contact_add', {
      url: '/bank/new/contact',
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/openbank/info/modal.html'),
          controller: require('view/openbank/info/modal')
        }
      }
    })

};

module.exports = router;
