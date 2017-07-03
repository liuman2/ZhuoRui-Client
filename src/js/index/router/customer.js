var views_customer = {
  'info': {
    template: require('view/customer/info/tmpl.html'),
    controller: require('view/customer/info/ctrl')
  }
};

var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('customer', { // list
      parent: 'list',
      url: '/customer',
      stateName: '客户列表',
      template: require('view/customer/list/tmpl.html'),
      controller: require('view/customer/list/ctrl')
    })
    .state('customer_add', {
      parent: 'list',
      url: '/customer/add',
      template: require('view/customer/info/tmpl.html'),
      controller: require('view/customer/info/ctrl')
    })
    .state('customer_add.contact_add', {
      url: '/new/contact',
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('customer_add.contact_edit', {
      url: '/new/contact/{index:.*}',
      params: {
        index: null,
        contactId: null,
        name: null,
        mobile: null,
        tel: null,
        position: null,
        email: null,
        wechat: null,
        QQ: null,
        responsable: null,
        memo: null,
      },
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('customer_edit', {
      url: '/customer/edit/{id:.*}',
      stateName: '编辑客户',
      template: require('view/customer/info/tmpl.html'),
      controller: require('view/customer/info/ctrl')
    })
    .state('customer_edit.contact_add', {
      url: '/new/contact',
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('customer_edit.contact_edit', {
      url: '/new/contact/{index:.*}',
      params: {
        index: null,
        contactId: null,
        name: null,
        mobile: null,
        tel: null,
        position: null,
        email: null,
        wechat: null,
        QQ: null,
        responsable: null,
        memo: null,
      },
      stateName: '联系人',
      views: {
        'contact': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('customer_view', {
      url: '/customer/view/{id:.*}',
      stateName: '查看客户',
      template: require('view/customer/view/tmpl.html'),
      controller: require('view/customer/view/ctrl')
    })
    .state('customer_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })

  .state('customer_view.bank_add', {
      url: '/new',
      views: {
        'modal': {
          template: require('view/customer/view/modal.html'),
          controller: require('view/customer/view/modal')
        }
      }
    })
    .state('customer_view.bank_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/customer/view/modal.html'),
          controller: require('view/customer/view/modal')
        }
      }
    })
    .state('customer_timeline', {
      parent: 'list',
      url: '/view/customer/timeline/{id:.*}',
      template: require('view/customer/timeline/tmpl.html'),
      controller: require('view/customer/timeline/ctrl')
    })
    .state('customer_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/customer/timeline/modal.html'),
          controller: require('view/customer/timeline/modal')
        }
      }
    })
    .state('customer_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/customer/timeline/modal.html'),
          controller: require('view/customer/timeline/modal')
        }
      }
    })

  .state('customer_add.dictionary', {
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
    .state('customer_edit.dictionary', {
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
