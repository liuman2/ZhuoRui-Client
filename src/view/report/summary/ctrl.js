var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams, $cookieStore) {

  var dInput = $('.date-input');
  $.datetimepicker.setLocale('ch');

  var start_time = new Date();
  start_time.setDate(1);
  start_time = moment(start_time).format('YYYY-MM-DD');
  var end_time = moment(new Date()).format('YYYY-MM-DD');

  $('#start_time').datetimepicker({
    format: 'Y-m-d',
    scrollInput: false,
    onShow: function(ct) {
      this.setOptions({
        maxDate: $('#end_time').val() ? $('#end_time').val() : new Date()
      })
    },
    timepicker: false
  });
  $('#end_time').datetimepicker({
    format: 'Y-m-d',
    scrollInput: false,
    onShow: function(ct) {
      this.setOptions({
        maxDate: new Date(),
        minDate: $('#start_time').val() ? $('#start_time').val() : false
      })
    },
    timepicker: false
  });
  $('#start_create').datetimepicker({
    format: 'Y-m-d',
    scrollInput: false,
    onShow: function(ct) {
      this.setOptions({
        maxDate: $('#end_create').val() ? $('#end_create').val() : new Date()
      })
    },
    timepicker: false
  });
  $('#end_create').datetimepicker({
    format: 'Y-m-d',
    scrollInput: false,
    onShow: function(ct) {
      this.setOptions({
        maxDate: new Date(),
        minDate: $('#start_create').val() ? $('#start_create').val() : false
      })
    },
    timepicker: false
  });

  var user = $cookieStore.get('USER_INFO');
  if (!user) {
    location.href = '/login.html';
  }

  if ($scope.userInfo.id == undefined) {
    $scope.userInfo = user;
  }

  if ($scope.opers == undefined) {
    $scope.opers = $cookieStore.get('USER_OPERS');
  }

  $scope.search = {
    customer_id: '',
    order_status: '',
    order_type: '',
    range: 2,
    salesman_id: $scope.userInfo.id,
    salesman: $scope.userInfo.name,
    start_time: start_time,
    end_time: end_time,
    name: '',
    start_create: end_time,
    end_create: end_time,
    orderBy: {
      field: 'code',
      order: 'desc'
    }
  }

  $scope.data = {
    items: []
  };

  $scope.query = function() {
    load_data();
  };

  $scope.detail = function(item) {
    switch (item.order_type) {
      case 'reg_abroad':
        $state.go("abroad_view", { id: item.id });
        break;
      case 'reg_internal':
        $state.go("internal_view", { id: item.id });
        break;
      case 'trademark':
        $state.go("trademark_view", { id: item.id });
        break;
      case 'patent':
        $state.go("patent_view", { id: item.id });
        break;
      case 'audit':
        $state.go("audit_view", { id: item.id });
        break;
      case 'annual_exam':
        $state.go("annual_view", { id: item.id });
        break;
    }
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getStatus = function(item) {
    switch (item.status) {
      case 0:
        return '未提交';
      case 1:
        return '已提交';
      case 2:
        return '财务已审核';
      case 3:
        return '提交人已审核';
      case 4:
        return '完成';
    }
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getReviewStatus = function(item) {
    switch (item.review_status) {
      case -1:
        return '未审核';
      case 0:
        return '驳回';
      case 1:
        return '审核通过';
    }
  }

  function load_data() {
    $http({
      method: 'POST',
      url: '/Report/OrderSummary',
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
