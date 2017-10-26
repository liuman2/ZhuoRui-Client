var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $cookieStore, $stateParams) {

  $scope.search = {
    index: 1,
    size: 20,
    name: ""
  }

  var searchStorage = sessionStorage.getItem('SEARCH_STORAGE');
  if (searchStorage) {
    var preSearch = JSON.parse(searchStorage);
    if (preSearch.key == $state.current.name) {
      $scope.search = preSearch.search;
    }
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

  $scope.query = function() {
    load_data();
  };

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  };

  function load_data() {
    $http({
      method: 'GET',
      url: '/BusinessBank/Search',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;

      var searchSession = {
        key: $state.current.name,
        search: angular.copy($scope.search)
      }

      sessionStorage.setItem('SEARCH_STORAGE', JSON.stringify(searchSession));
    });
  }

  load_data();
}
