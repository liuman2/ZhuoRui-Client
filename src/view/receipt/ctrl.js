var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams, $cookieStore) {

  // $scope.search = {
  //   title: '',
  //   order_status: '',
  //   area: ''
  // }

  $scope.search = {
    index: 1,
    size: 20,
  }

  if ($scope.opers == undefined) {
    $scope.opers = $cookieStore.get('USER_OPERS');
  }

  var user = $cookieStore.get('USER_INFO');
  if (!user) {
    location.href = '/login.html';
  }

  if ($scope.userInfo.id == undefined) {
    $scope.userInfo = user;
  }

  $scope.data = {
    items: []
  };

  $scope.query = function() {
    load_data();
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  };

  $scope.onPrint = function(item) {
    window.open('/print.html?t=receipt&m=' + item.order_source + '&id=' + item.order_id, '_blank');
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/Receipt/Search',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
