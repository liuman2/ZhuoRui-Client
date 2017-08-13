var router = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      stateName: '我的桌面',
      template: require('view/dashboard/tmpl.html'),
      controller: require('view/dashboard/ctrl')
    })
    .state('dashboard.event_add', {
      url: '/event/new',
      stateName: '日程安排',
      views: {
        'event': {
          template: require('view/dashboard/event.html'),
          controller: require('view/dashboard/event')
        }
      }
    })
    .state('dashboard.event_edit', {
      url: '/event/edit',
      stateName: '日程安排',
      views: {
        'event': {
          template: require('view/dashboard/event.html'),
          controller: require('view/dashboard/event')
        }
      }
    })
};

module.exports = router;
