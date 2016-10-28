var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
  $scope.search = {
    index: 1,
    size: 20,
    name: ""
  }

  $scope.data = {
    items: [],
    page: {
      current_index: 0,
      current_size: 0,
      total_page: 0,
      total_size: 0
    }
  };

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  function load_data() {
    $http({
      method: 'GET',
      params: $scope.search,
      url: '/Notice/Views'
    }).success(function(data) {
      console.log(data)
      $scope.data = data;
    });
  }

  load_data();
}
