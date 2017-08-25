var views_internal = {
  'info': {
    template: require('view/internal/info/tmpl.html'),
    controller: require('view/internal/info/ctrl')
  }
};

var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('internal', {
      parent: 'list',
      url: '/internal',
      template: require('view/internal/list/tmpl.html'),
      controller: require('view/internal/list/ctrl')
    })
    .state('internal_add', {
      parent: 'list',
      url: '/internal/add',
      template: require('view/internal/info/tmpl.html'),
      controller: require('view/internal/info/ctrl')
    })
    .state('internal_add.shareholder_add', {
      url: '/new/shareholder',
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/internal/shareholder/modal.html'),
          controller: require('view/internal/shareholder/modal')
        }
      }
    })
    .state('internal_add.shareholder_edit', {
      url: '/new/shareholder/{shareholderId:.*}',
      params: {
        index: null,
        shareholderId: null,
        name: null,
        gender: null,
        position: null,
        cardNo: null,
        takes: null,
      },
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/internal/shareholder/modal.html'),
          controller: require('view/internal/shareholder/modal')
        }
      }
    })
    .state('internal_edit.shareholder_add', {
      url: '/new/shareholder',
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/internal/shareholder/modal.html'),
          controller: require('view/internal/shareholder/modal')
        }
      }
    })
    .state('internal_edit.shareholder_edit', {
      url: '/new/shareholder/{shareholderId:.*}',
      params: {
        index: null,
        shareholderId: null,
        name: null,
        gender: null,
        cardNo: null,
        position: null,
        takes: null,
      },
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/internal/shareholder/modal.html'),
          controller: require('view/internal/shareholder/modal')
        }
      }
    })

    .state('internal_add.director_add', {
      url: '/new/director',
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/internal/director/modal.html'),
          controller: require('view/internal/director/modal')
        }
      }
    })
    .state('internal_add.director_edit', {
      url: '/new/director/{directorId:.*}',
      params: {
        index: null,
        directorId: null,
        name: null,
        gender: null,
        position: null,
        cardNo: null,
      },
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/internal/director/modal.html'),
          controller: require('view/internal/director/modal')
        }
      }
    })
    .state('internal_edit.director_add', {
      url: '/new/director',
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/internal/director/modal.html'),
          controller: require('view/internal/director/modal')
        }
      }
    })
    .state('internal_edit.director_edit', {
      url: '/new/director/{directorId:.*}',
      params: {
        index: null,
        directorId: null,
        name: null,
        gender: null,
        cardNo: null,
        position: null,
      },
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/internal/director/modal.html'),
          controller: require('view/internal/director/modal')
        }
      }
    })

    .state('internal_add.bank_add', {
      url: '/internal/add/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })

    .state('internal_add.item_add', {
      url: '/new/item',
      stateName: '委托事项',
      views: {
        'internal_item': {
          template: require('view/common/internalItem/modal.html'),
          controller: require('view/common/internalItem/modal')
        }
      }
    })
    .state('internal_add.item_edit', {
      url: '/new/item/{index:.*}',
      params: {
        itemId: null,
        name: null,
        material: null,
        spend: null,
        price: null,
        memo: null,
      },
      stateName: '委托事项',
      views: {
        'internal_item': {
          template: require('view/common/internalItem/modal.html'),
          controller: require('view/common/internalItem/modal')
        }
      }
    })

    .state('internal_edit', {
      url: '/internal/edit/{id:.*}',
      template: require('view/internal/info/tmpl.html'),
      controller: require('view/internal/info/ctrl')
    })
    .state('internal_edit.item_add', {
      url: '/new/item',
      stateName: '委托事项',
      views: {
        'internal_item': {
          template: require('view/common/internalItem/modal.html'),
          controller: require('view/common/internalItem/modal')
        }
      }
    })
    .state('internal_edit.item_edit', {
      url: '/new/item/{index:.*}',
      params: {
        itemId: null,
        name: null,
        material: null,
        spend: null,
        price: null,
        memo: null,
      },
      stateName: '委托事项',
      views: {
        'internal_item': {
          template: require('view/common/internalItem/modal.html'),
          controller: require('view/common/internalItem/modal')
        }
      }
    })

    .state('internal_view', {
      url: '/internal/view/{id:.*}',
      template: require('view/internal/view/tmpl.html'),
      controller: require('view/internal/view/ctrl')
    })
    .state('internal_view.income_add', {
      url: '/new/{source_name:.*}/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('internal_view.income_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('internal_view.audit', {
      url: '/audit/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })
    .state('internal_view.creator', {
      url: '/creator',
      views: {
        'modal': {
          template: require('view/common/creator/modal.html'),
          controller: require('view/common/creator/modal')
        }
      }
    })
    .state('internal_view.pass', {
      url: '/audit/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/pass.html'),
          controller: require('view/common/audit/pass')
        }
      }
    })

    .state('internal_view.done', {
      url: '/done/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/orderDone/modal.html'),
          controller: require('view/common/orderDone/modal')
        }
      }
    })
    .state('internal_view.receipt', {
      url: '/internal/receipt/{type:.*}/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
    .state('internal_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })
    .state('internal_view.item_add', {
      url: '/new/item',
      stateName: '委托事项',
      views: {
        'internal_item': {
          template: require('view/common/internalItem/modal.html'),
          controller: require('view/common/internalItem/modal')
        }
      }
    })
    .state('internal_timeline', {
      url: '/view/internal/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('internal_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('internal_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })

    .state('internal_history', {
      url: '/view/internal/history/{id:.*}',
      template: require('view/internal/history/tmpl.html'),
      controller: require('view/internal/history/ctrl')
    })
    .state('internal_history.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/internal/history/modal.html'),
          controller: require('view/internal/history/modal')
        }
      }
    })
    .state('internal_history.edit', {
      url: '/edit',
      views: {
        'add': {
          template: require('view/internal/history/modal.html'),
          controller: require('view/internal/history/modal')
        }
      }
    })

  .state('internal.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('internal.progress.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('internal_view.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('internal_view.progress.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('internal_view.feedback', {
      url: '/feedback',
      views: {
        'feedback': {
          template: require('view/internal/view/feedback.html'),
          controller: require('view/internal/view/feedback')
        }
      }
    })

    .state('internal_add.dictionary', {
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
    .state('internal_edit.dictionary', {
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
