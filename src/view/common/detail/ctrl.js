var Nav = require('js/index/nav');

module.exports = function ($scope, $state) {
  $scope.$parent.bodyClass = 'grey';

  $scope.breadcrumb = [];

  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {

      var breadcrumb = [];

      var stateNameSplit = toState.name.split('.');

      breadcrumb.push({
        name: Nav[Nav.map[stateNameSplit[0]].id].name
      });

      for (var i in stateNameSplit) {
        var end = Number(i) + 1;
        var stateArray = stateNameSplit.slice(0, end);
        var stateName = stateArray.join('.');

        var state = $state.get(stateName);

        if (state && state.stateName) {  //state.abstract===false &&
          breadcrumb.push({
            name: state.stateName,
            route: state.name === toState.name ? '' : state.name
          });
        }
      }

      $scope.breadcrumb = breadcrumb;
  });

};
