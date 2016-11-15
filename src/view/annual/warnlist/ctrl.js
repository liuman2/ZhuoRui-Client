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
    return item.month > 0;
    /*var dt = item.date_setup;
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];

      var t1 = moment(dt);
      var t2 = moment();

      if (t1.month() == t2.month()) {
        if (t1.date() <= t2.date()) {
          return true;
        }
        return false;
      }

      var m2 = moment().add(2, 'month');
      var m1 = new Date(m2.year(), t1.month(), t1.date());
      if (m1.getMonth() == m2.month()) {
        return false;
      }
      if (m1 >= m2) {
        return false;
      }
      return true;
    } else {
      return false;
    }*/
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
