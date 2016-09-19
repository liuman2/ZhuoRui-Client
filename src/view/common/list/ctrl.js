var Nav = require('js/index/nav');

module.exports = function ($scope, $state) {
  $scope.$parent.bodyClass = '';

  var route = $state.current.name;

  var id = Nav.map[route].id;

  $scope.navs = Nav[id].nav;

  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      var route = toState.name;

      var id = Nav.map[route].id;

      $scope.navs = Nav[id].nav;
  });
};
