
var router = function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tax_warning', {
      // parent: 'list',
      url: '/tax/warning',
      template: require('view/abroad/tax_warning/tmpl.html'),
      controller: require('view/abroad/tax_warning/ctrl')
    })
    .state('tax_warning.sendDate', {
      url: '/tax/warning/{orderId:.*}',
      params: {
        code: null,
        orderId: null,
        name_cn: null,
        name_en: null,
      },

      url: '/senddate',
      views: {
        'modal': {
          template: require('view/abroad/tax_warning/modal.html'),
          controller: require('view/abroad/tax_warning/modal')
        }
      }
    })
};

module.exports = router;
