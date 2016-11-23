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
    switch (type) {
      case 'annual':
        $state.go("annual_add", { order_type: item.order_type, order_id: item.id });
        break;
      case 'audit':
        $state.go("audit_add_s", { order_type: item.order_type, order_id: item.id });
        break;
      case 'done':
        $.confirm({
          title: false,
          content: '您确认该笔订单' + (new Date()).getFullYear() + '年度已经年检？',
          confirmButton: '确定',
          cancelButton: '取消',
          confirm: function() {
            console.log(item.order_type)
            $http({
              method: 'POST',
              url: '/Annual/DoneThisYear',
              params: {
                orderType: item.order_type,
                orderId: item.id
              }
            }).success(function(data) {
              load_data();
            });
          }
        });
        break;
    }
  };

  $scope.getRedWarning = function(item) {
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

  $scope.getMonth = function(item) {

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

  function resizable(th, options) {
    var pressed = false
    var start = undefined
    var startX, startWidth

    options = options || {}
    var min = options.min || 30

    $(th).css({
      cursor: 'e-resize'
    })

    $(th).each(function(index, ele) {
      const _width = $(ele).width()
      $(ele).width(_width)
    })

    $(th).mousedown(function(e) {
      start = $(this);
      pressed = true;
      startX = e.pageX;
      startWidth = $(this).width();
    })

    $(document).mousemove(function(e) {
      if (pressed) {
        var width = startWidth + (e.pageX - startX)
        width = width < min ? min : width
        $(start).width(width);
      }
    })

    $(document).mouseup(function() {
      if (pressed) pressed = false;
    })

  }

  resizable('table th');
}
