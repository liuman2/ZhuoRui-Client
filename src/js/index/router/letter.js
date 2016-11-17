var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('letter', {
      parent: 'list',
      url: '/letter',
      template: require('view/letter/list/tmpl.html'),
      controller: require('view/letter/list/ctrl')
    })
    .state('letter_add', {
      parent: 'list',
      url: '/letter/add',
      template: require('view/letter/info/tmpl.html'),
      controller: require('view/letter/info/ctrl')
    })
    .state('letter_edit', {
      url: '/letter/edit/{id:.*}',
      template: require('view/letter/info/tmpl.html'),
      controller: require('view/letter/info/ctrl')
    })
    .state('letter_view', {
      url: '/letter/view/{id:.*}',
      template: require('view/letter/view/tmpl.html'),
      controller: require('view/letter/view/ctrl')
    })
    .state('letter_view.audit', {
      url: '/letter/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })

    .state('inbox', {
      parent: 'list',
      url: '/inbox',
      template: require('view/inbox/list/tmpl.html'),
      controller: require('view/inbox/list/ctrl')
    })
    .state('inbox_add', {
      parent: 'list',
      url: '/inbox/add',
      template: require('view/inbox/info/tmpl.html'),
      controller: require('view/inbox/info/ctrl')
    })
    .state('inbox_edit', {
      url: '/inbox/edit/{id:.*}',
      template: require('view/inbox/info/tmpl.html'),
      controller: require('view/inbox/info/ctrl')
    })
    .state('inbox_view', {
      url: '/inbox/view/{id:.*}',
      template: require('view/inbox/view/tmpl.html'),
      controller: require('view/inbox/view/ctrl')
    })
    .state('inbox_view.audit', {
      url: '/inbox/{module_name:.*}',
      views: {
        'modal': {
          template: require('view/common/audit/modal.html'),
          controller: require('view/common/audit/modal')
        }
      }
    })
};

module.exports = router;
