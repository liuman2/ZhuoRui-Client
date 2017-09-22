var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('annual_warning', {
      // parent: 'list',
      url: '/annual/warning',
      template: require('view/annual/warnlist/tmpl.html'),
      controller: require('view/annual/warnlist/ctrl')
    })
    .state('annual_warning.forsale', {
      url: '/annual/warning/forsale',
      params: {
        order_id: null,
        order_type: null,
      },
      views: {
        'modal': {
          template: require('view/common/forsale/modal.html'),
          controller: require('view/common/forsale/modal')
        }
      }
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
    .state('annual_add.customer_edit', {
      url: '/annual/customer/edit/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/customer/modal.html'),
          controller: require('view/common/customer/modal')
        }
      }
    })
    .state('annual_add.contact_add', {
      url: '/annual/contact/edit/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('annual_add.contact_edit', {
      url: '/annual/contact/edit/{customer_id:.*}',
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
        'modal': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })




    .state('annual_edit', {
      url: '/annual/edit/{id:.*}',
      template: require('view/annual/info/tmpl.html'),
      controller: require('view/annual/info/ctrl')
    })
    .state('annual_edit.customer_edit', {
      url: '/annual/customer/edit/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/customer/modal.html'),
          controller: require('view/common/customer/modal')
        }
      }
    })
    .state('annual_edit.contact_add', {
      url: '/annual/contact/edit/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
    })
    .state('annual_edit.contact_edit', {
      url: '/annual/contact/edit/{customer_id:.*}',
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
        'modal': {
          template: require('view/common/contact/modal.html'),
          controller: require('view/common/contact/modal')
        }
      }
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
      url: '/annual/receipt/{type:.*}/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
    .state('annual_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })
    .state('annual_timeline', {
      url: '/view/annual/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('annual_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('annual_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
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
