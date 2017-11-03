var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams, $cookieStore) {

  $scope.search = {
    title: '',
    order_status: '',
    area: ''
  }

  var searchStorage = sessionStorage.getItem('SEARCH_STORAGE');
  if (searchStorage) {
    var preSearch = JSON.parse(searchStorage);
    if (preSearch.key == $state.current.name) {
      $scope.search = preSearch.search;
    }
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

  $scope.query = function () {
    load_data();
  };

  $scope.format = function (dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getMonth = function (item) {
    // item.month <= 0 ? '-' : item.month
    var dt = item.date_setup;
    var t2 = moment();
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];
      var t1 = moment(dt);
      if (t1.year() == t2.year()) {
        return '-';
      }
    }

    if (item.annual_year == t2.year()) {
      return '-';
    }

    return item.month <= 0 ? '-' : item.month
  }

  $scope.getRedWarning = function (item) {
    if (item.month > 0) {
      return true;
    }
    // return item.month > 0;
    var dt = item.date_setup;
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];

      var t1 = moment(dt);
      var t2 = moment();

      if (t1.year() == t2.year()) {
        return false;
      }

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
    }
  }

  $scope.getOrderStatus = function (status) {
    status = status - 0;
    // order_status 0-正常，1-转出，2-注销，3-暂不年检 4-待售 5-卖出  6-除名

    switch (status) {
      case 1:
        return '转出';
      case 2:
        return '注销';
      case 3:
        return '暂不年检';
      case 4:
        return '待售';
      case 5:
        return '卖出';
      case 6:
        return '除名';
    }
  }

  $scope.revert = function (item) {
    var status = ['转出', '注销', '暂不年检'];
    var msg = `${item.order_type_name}订单【${item.order_name || item.order_code}】，已${status[item.order_status - 1]}，确定要恢复年检吗？`;
    $.confirm({
      title: false,
      content: msg,
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function () {
        $http({
          method: 'GET',
          url: '/Annual/Revert',
          params: {
            id: item.id,
            type: item.order_type,
          }
        }).success(function (data) {
          load_data();
        });
      }
    });
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/Annual/OffOrders',
      params: $scope.search
    }).success(function (data) {
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
