var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams, $cookieStore) {

  $scope.search = {
    customer_id: '',
    waiter_id: '',
    salesman_id: '',
    name: ''
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

  if ($scope.opers.indexOf(5) > -1) {
    $scope.search.waiter_id = $scope.userInfo.id;
    $scope.search.waiter_name = $scope.userInfo.name;
  } else {
    $scope.search.salesman_id = $scope.userInfo.id;
    $scope.search.salesman = $scope.userInfo.name;
  }

  $scope.data = {
    items: []
  };

  $scope.query = function() {

    load_data();
  };

  $scope.new_annual = function(item, type) {
    console.log(item);
    if (type == 'annual') {
      $state.go("annual_add", { order_type: item.order_type, order_id: item.id });
    } else {
      $state.go("audit_add_s", { order_type: item.order_type, order_id: item.id });
    }
  };

  $scope.getRedWarning = function(item) {
    var dt = item.date_setup;
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];
      var t1 = new Date(dt);
      var t2 = new Date();
      var t3 = new Date(t2.getFullYear(), t1.getMonth(), t1.getDate());
      return t2 >= t3;
    } else {
      return false;
    }
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
      url: '/Annual/Warning',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
