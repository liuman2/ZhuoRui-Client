var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
  var dInput = $('.date-input');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    maxDate: new Date(),
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.search = {
    index: 1,
    size: 20,
    customer_id: '',
    status: '',
    start_time: '',
    end_time: '',
    name: '',
    code: '',
    start_create: '',
    end_create: '',
    orderBy: {
      field: 'code',
      order: 'desc'
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

  $scope.delete = function(item) {
    if (item.status == 4) {
      $.alert({
        title: false,
        content: '订单已完成不能删除',
        confirmButton: '确定'
      });
      return;
    }

    if (item.status > 0) {
      $.alert({
        title: false,
        content: '已提交审核不能删除',
        confirmButton: '确定'
      });
      return;
    }

    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/RegInternal/Delete',
          params: {
            id: item.id
          }
        }).success(function(data) {
          load_data();
        });
      }
    });

  }

  $scope.edit = function(item) {
    /*if (item.status == 4) {
      $.alert({
        title: false,
        content: '订单已完成不能修改',
        confirmButton: '确定'
      });
      return;
    }

    if (item.status > 0) {
      $.alert({
        title: false,
        content: '已提交审核不能修改',
        confirmButton: '确定'
      });
      return;
    }*/

    // $state.go("internal_edit", { id: item.id });

    var url = $state.href('internal_edit', { id: item.id });
    window.open(url,'_blank');
  }

  $scope.history = function(item) {
    if (item.status != 4) {
      alert('还未完成的订单没法做变更记录，请直接修改。');
      return;
    }

    // $state.go("internal_history", {id: item.id});
    // $state.go("history", { module_id: 'internal', code: item.code, source_id: item.id, customer_id: item.customer_id });

    var url = $state.href('history', { module_id: 'internal', code: item.code, source_id: item.id, customer_id: item.customer_id });
    window.open(url,'_blank');
  }

  $scope.progress = function(item, t) {
    // if (item.status == 4) {
    //     alert('订单已完成，无需再更新进度');
    //     return;
    // }

    if (item.status < 3) {
      $.alert({
        title: false,
        content: t == 'p' ? '提交人还未提交该订单，无法更新进度' : '提交人还未提交该订单，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    if (item.review_status != 1) {
      $.alert({
        title: false,
        content: t == 'p' ? '订单未通过审核，无法更新进度' : '订单未通过审核，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".progress", { id: item.id, module_name: 'RegInternal', type: t }, { location: false });
  }

  $scope.$on('PROGRESS_MODAL_DONE', function(e) {
    load_data();
  });

  $scope.getOrderStatus = function(status, orderStatus) {
    if (orderStatus != 0) {
      if (orderStatus == 1) {
        return '转出'
      }
      if (orderStatus == 2) {
        return '注销'
      }
      if (orderStatus == 3) {
        return '暂不年检'
      }
      if (orderStatus == 4) {
        return '待售'
      }
      if (orderStatus == 5) {
        return '卖出'
      }
    }
    switch (status) {
      case 0:
      case 1:
      case 2:
      case 3:
        return '未完成';
      case 4:
        return '完成';
      case 5:
        return '买入';
    }
  }

  $scope.getReviewStatus = function(status, review_status) {
    switch (review_status) {
      case -1:
        return '未审核';
      case 0:
        return '驳回';
      case 1:
        {
          if (status == 2) {
            return '财务已审核';
          }
          if (status >= 3) {
            return '已审核';
          }
        }
    }
  }

  $scope.getTitle = function(item, i) {
    if (item.review_status == 0) {
      $('#tool-tip' + i).tooltipster({
        theme: 'tooltipster-sideTip-shadow',
        content: item.finance_review_moment || item.submit_review_moment,
      });

      return item.finance_review_moment || item.submit_review_moment;
    }
    return '';
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  function load_data() {
    $scope.search.start_time = $('#start_time').val();
    $scope.search.end_time = $('#end_time').val();
    $scope.search.start_create = $('#start_create').val();
    $scope.search.end_create = $('#end_create').val();
    $http({
      method: 'GET',
      url: '/RegInternal/Search',
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
