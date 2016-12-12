var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {

  $scope.search = {
    customer_id: '',
    order_status: 0,
    order_type: '',
    salesman_id: ''
  }

  $scope.data = {
    items: []
  };

  $scope.query = function() {
    load_data();
  };

  $scope.detail = function(item) {
    console.log(item);
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
      case 'history':
        $state.go("history_view", { id: item.id });
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
    if (item.status == 1) {
      return '未审核';
    }
    if (item.status == 4) {
      return '已完成';
    }

    if (item.status == 3) {
      return '审核通过';
    }

    if (item.review_status == 0) {
      return '审核驳回';
    }

    if (item.review_status == 1) {
      return '审核通过';
    }
  }

  $scope.getOpt = function(item) {
    if (item.status == 1) {
      return '马上审核';
    }
    return '查看详情';
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/OrderCheck/FinanceCheck',
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
