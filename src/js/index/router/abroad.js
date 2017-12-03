var views_abroad = {
  'info': {
    template: require('view/abroad/info/tmpl.html'),
    controller: require('view/abroad/info/ctrl')
  }
};

var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('abroad', {
      parent: 'list',
      url: '/abroad',
      template: require('view/abroad/list/tmpl.html'),
      controller: require('view/abroad/list/ctrl')
    })
    .state('abroad.bank', {
      url: '/abroad/bank',
      params: {
        tid: null,
        order_id: null,
        customer_id: null,
        module_name: null,
      },
      views: {
        'bank': {
          template: require('view/common/businessBank/modal.html'),
          controller: require('view/common/businessBank/modal')
        }
      }
    })
    .state('abroad_add', {
      parent: 'list',
      url: '/abroad/add',
      template: require('view/abroad/info/tmpl.html'),
      controller: require('view/abroad/info/ctrl')
    })
    .state('abroad_add.shareholder_add', {
      url: '/new/shareholder',
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/abroad/shareholder/modal.html'),
          controller: require('view/abroad/shareholder/modal')
        }
      }
    })
    .state('abroad_add.shareholder_edit', {
      url: '/new/shareholder/{shareholderId:.*}',
      params: {
        index: null,
        shareholderId: null,
        name: null,
        gender: null,
        cardNo: null,
        takes: null,
      },
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/abroad/shareholder/modal.html'),
          controller: require('view/abroad/shareholder/modal')
        }
      }
    })
    .state('abroad_edit.shareholder_add', {
      url: '/new/shareholder',
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/abroad/shareholder/modal.html'),
          controller: require('view/abroad/shareholder/modal')
        }
      }
    })
    .state('abroad_edit.shareholder_edit', {
      url: '/new/shareholder/{shareholderId:.*}',
      params: {
        index: null,
        shareholderId: null,
        name: null,
        gender: null,
        cardNo: null,
        takes: null,
      },
      stateName: '股东',
      views: {
        'shareholder': {
          template: require('view/abroad/shareholder/modal.html'),
          controller: require('view/abroad/shareholder/modal')
        }
      }
    })

    //
    .state('abroad_add.director_add', {
      url: '/new/director',
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/abroad/director/modal.html'),
          controller: require('view/abroad/director/modal')
        }
      }
    })
    .state('abroad_add.director_edit', {
      url: '/new/director/{directorId:.*}',
      params: {
        index: null,
        directorId: null,
        name: null,
        gender: null,
        cardNo: null,
      },
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/abroad/director/modal.html'),
          controller: require('view/abroad/director/modal')
        }
      }
    })
    .state('abroad_edit.director_add', {
      url: '/new/director',
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/abroad/director/modal.html'),
          controller: require('view/abroad/director/modal')
        }
      }
    })
    .state('abroad_edit.director_edit', {
      url: '/new/director/{directorId:.*}',
      params: {
        index: null,
        directorId: null,
        name: null,
        gender: null,
        cardNo: null,
      },
      stateName: '董事',
      views: {
        'shareholder': {
          template: require('view/abroad/director/modal.html'),
          controller: require('view/abroad/director/modal')
        }
      }
    })


    .state('abroad_add.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('abroad_edit', {
      url: '/abroad/edit/{id:.*}',
      template: require('view/abroad/info/tmpl.html'),
      controller: require('view/abroad/info/ctrl')
    })
    .state('abroad_view', {
      url: '/abroad/view/{id:.*}',
      template: require('view/abroad/view/tmpl.html'),
      controller: require('view/abroad/view/ctrl')
    })
    .state('abroad_view.income_add', {
      url: '/new/{source_name:.*}/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('abroad_view.income_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('abroad_view.audit', {
      url: '/audit/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })
    .state('abroad_view.pass', {
      url: '/audit/{module_name:.*}/{id:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/pass.html'),
          controller: require('view/common/audit/pass')
        }
      }
    })

    .state('abroad_view.done', {
      url: '/done/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/orderDone/modal.html'),
          controller: require('view/common/orderDone/modal')
        }
      }
    })
    .state('abroad_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })

  .state('abroad_view.receipt', {
      url: '/abroad/receipt/{type:.*}/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
    .state('abroad_view.bank', {
        url: '/abroad/bank',
        params: {
          tid: null,
          order_id: null,
          customer_id: null,
          module_name: null,
        },
        views: {
          'bank': {
            template: require('view/common/businessBank/modal.html'),
            controller: require('view/common/businessBank/modal')
          }
        }
      })

    .state('abroad_timeline', {
      url: '/view/abroad/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('abroad_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('abroad_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('abroad.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type: .*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('abroad.progress.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('abroad_view.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type: .*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('abroad_view.progress.bank_add', {
      url: '/progress/bank/{customer_id:.*}',
      views: {
        'bank': {
          template: require('view/common/bank/modal.html'),
          controller: require('view/common/bank/modal')
        }
      }
    })
    .state('abroad_add.dictionary', {
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
    .state('abroad_edit.dictionary', {
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
    .state('abroad_view.creator', {
      url: '/creator',
      views: {
        'modal': {
          template: require('view/common/creator/modal.html'),
          controller: require('view/common/creator/modal')
        }
      }
    })
};

module.exports = router;
