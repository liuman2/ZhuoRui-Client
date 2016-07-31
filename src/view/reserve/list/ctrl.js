var dateHelper = require('js/utils/dateHelper');

module.exports = function ($scope, $http, $state, $stateParams) {


  $scope.data = [];

  function load_data() {
      $http({
          method: 'GET',
          url: '/Reserve/List'
      }).success(function(data) {
          $scope.data = data;
      });
  }

  load_data();
}
