module.exports = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('coding', {
      url: '/settings/coding',
      template: require('view/settings/coding/tmpl.html'),
      controller: require('view/settings/coding/ctrl')
    })
  $stateProvider
    .state('settings', {
      url: '/settings/param',
      template: require('view/settings/param/tmpl.html'),
      controller: require('view/settings/param/ctrl')
    })
};
