var views_patent = {
  'info': {
    template: require('view/patent/info/tmpl.html'),
    controller: require('view/patent/info/ctrl')
  }
};

var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('patent', {
      parent: 'list',
      url: '/patent',
      template: require('view/patent/list/tmpl.html'),
      controller: require('view/patent/list/ctrl')
    })
    .state('patent_add', {
      parent: 'list',
      url: '/patent/add',
      template: require('view/patent/info/tmpl.html'),
      controller: require('view/patent/info/ctrl')
    })
    .state('patent_edit', {
      url: '/patent/edit/{id:.*}',
      template: require('view/patent/info/tmpl.html'),
      controller: require('view/patent/info/ctrl')
    })
    .state('patent_view', {
      url: '/patent/view/{id:.*}',
      template: require('view/patent/view/tmpl.html'),
      controller: require('view/patent/view/ctrl')
    })
    .state('patent_view.income_add', {
      url: '/new/{source_name:.*}/{customer_id:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('patent_view.income_edit', {
      url: '/edit/{tid:.*}',
      views: {
        'modal': {
          template: require('view/common/income/modal.html'),
          controller: require('view/common/income/modal')
        }
      }
    })
    .state('patent_view.audit', {
      url: '/audit/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })
    .state('patent_view.done', {
      url: '/done/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/orderDone/modal.html'),
          controller: require('view/common/orderDone/modal')
        }
      }
    })
    .state('patent_view.creator', {
      url: '/creator',
      views: {
        'modal': {
          template: require('view/common/creator/modal.html'),
          controller: require('view/common/creator/modal')
        }
      }
    })
    .state('patent_view.receipt', {
      url: '/patent/receipt/{type:.*}/{source_name:.*}',
      views: {
        'print': {
          template: require('view/common/receipt/modal.html'),
          controller: require('view/common/receipt/modal')
        }
      }
    })
    .state('patent_view.attachment', {
      url: '/new/attachment/{source_name:.*}/{source_id:.*}',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/common/attachment/modal.html'),
          controller: require('view/common/attachment/modal')
        }
      }
    })
    .state('patent_timeline', {
      url: '/view/patent/timeline/{source:.*}/{id:.*}/{name:.*}/{code:.*}',
      template: require('view/common/timeline/tmpl.html'),
      controller: require('view/common/timeline/ctrl')
    })
    .state('patent_timeline.add', {
      url: '/new',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })
    .state('patent_timeline.edit', {
      url: '/edit/{tid:.*}',
      views: {
        'add': {
          template: require('view/common/timeline/modal.html'),
          controller: require('view/common/timeline/modal')
        }
      }
    })

  .state('patent.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('patent_view.progress', {
      url: '/progress/{id:.*}/{module_name:.*}/{type:.*}',
      views: {
        'progress': {
          template: require('view/common/progress/modal.html'),
          controller: require('view/common/progress/modal')
        }
      }
    })
    .state('patent_add.dictionary', {
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
    .state('patent_edit.dictionary', {
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
