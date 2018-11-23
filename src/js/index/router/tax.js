
var router = function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tax_timeline', {
      url: '/view/tax/timeline/{source:.*}/{id:.*}/{name:.*}',
      template: require('view/common/timeline/alone.html'),
      controller: require('view/common/timeline/alone')
    })
    .state('tax_warning', {
      // parent: 'list',
      url: '/tax/warning',
      template: require('view/abroad/tax_warning/tmpl.html'),
      controller: require('view/abroad/tax_warning/ctrl')
    })
    .state('tax_list', {
      // parent: 'list',
      url: '/tax/list/{orderId:.*}',
      template: require('view/abroad/tax_warning/list.html'),
      controller: require('view/abroad/tax_warning/list')
    })
    .state('tax_warning.sendDate', {
      url: '/tax/warning/{orderId:.*}',
      params: {
        code: null,
        orderId: null,
        name_cn: null,
        name_en: null,
        end_date: null,
        tax_record_id: null,
      },
      url: '/senddate',
      views: {
        'modal': {
          template: require('view/abroad/tax_warning/modal.html'),
          controller: require('view/abroad/tax_warning/modal')
        }
      }
    })
    .state('tax_warning.noaduit', {
      params: {
        code: null,
        orderId: null,
        recordId: null,
        name_cn: null,
        name_en: null,
      },
      url: '/new/noaduit',
      stateName: '附件',
      views: {
        'attachment': {
          template: require('view/abroad/tax_warning/no_audit.html'),
          controller: require('view/abroad/tax_warning/no_audit')
        }
      }
    })
};

module.exports = router;
