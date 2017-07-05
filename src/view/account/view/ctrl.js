var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout, $cookieStore) {

  var id = $state.params.id || null;

  if (!!id) {
    $scope.id = id;
    actionView();
  }
  $scope.data = {
    status: 0,
    review_status: -1
  }

  if ($scope.opers == undefined) {
    $scope.opers = $cookieStore.get('USER_OPERS');
  }

  $scope.items = [];

  $scope.deleteIncome = function(item) {
    if ($scope.data.status > 0) {
      $.alert({
        title: false,
        content: '已提交审核不能删除',
        confirmButton: '确定'
      });
      return;
    }

    if ($scope.data.status == 4) {
      $.alert({
        title: false,
        content: '订单已完成不能删除',
        confirmButton: '确定'
      });
      return;
    }

    if ($scope.data.review_status == 1) {
      var msg = $scope.data.status == 2 ? '已通过财务审核不能删除' : '已通过提交人审核不能删除';
      $.alert({
        title: false,
        content: msg,
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
          url: '/Income/Delete',
          params: {
            id: item.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.deleteSub = function(subId) {
    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Accounting/DeleteItem',
          params: {
            id: subId
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.expandSub = function(item, e) {
    if ($(e.target).closest('i').attr('class').indexOf('fa-plus') < 0) {
      return;
    }

    $http({
      method: 'GET',
      url: '/Accounting/GetPeriodProgress',
      params: {
        id: item.id
      }
    }).success(function(data) {
      item.progressList = data || [];
    });
  }

  $scope.incomes = {
    items: [],
    total: 0,
    balance: 0
  };

  $scope.edit = function() {
    $state.go("account_edit", {
      id: id
    });
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.cancel = function() {
    $state.go('account');
  }

  $scope.submitAudit = function() {
    $.confirm({
      title: false,
      content: '您确认要提交审核？提交后不可再编辑',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Accounting/Submit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.passAuditF = function() {
    $.confirm({
      title: false,
      content: '您确认通过审核？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Accounting/PassAudit',
          params: {
            id: $scope.data.id,
            waiter_id: 0
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

    $scope.getOrderStatus = function() {
    switch ($scope.data.status) {
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

  $scope.getReviewStatus = function() {
    switch ($scope.data.review_status) {
      case -1:
        return '未审核';
      case 0:
        return '驳回';
      case 1:
        return '审核通过';
    }
  }

  $scope.passAudit = function() {
    $state.go(".pass", { module_name: 'Accounting' }, { location: false });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'Accounting' }, { location: false });
  }


  $scope.getTitle = function(item) {
    if (item.review_status == 0) {
      $('.tooltip-author').tooltipster({
        theme: 'tooltipster-sideTip-shadow',
        content: item.finance_review_moment || item.submit_review_moment,
      });

      return item.finance_review_moment || item.submit_review_moment;
    }
    return '';
  }

  $scope.getMonths = function(item) {
    var startDate = new Date(item.date_start);
    var endDate = new Date(item.date_end);
    var totalMonth = (endDate.getFullYear() * 12 + endDate.getMonth()) - (startDate.getFullYear() * 12 + startDate.getMonth());
    return (totalMonth + 1) + '个月';
  }

  $scope.printReceipt = function(t) {
    $state.go(".receipt", { type: t, source_name: 'accounting' }, { location: false });
  }

  $scope.$on('INCOME_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('REFUSE_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('UPDATE_SUB_DONE', function(e) {
    actionView();
  });

  $scope.$on('PROGRESS_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.onTab = function(item, i) {
    item.activeTab = i;
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Accounting/GetView',
      params: {
        id: id
      }
    }).success(function(data) {
      // console.log(data);
      $scope.data = data.order;
      $scope.incomes = data.incomes;
      var items = data.items || [];
      if (items.length > 0) {
        $.each(items, function (i, item) {
          item.activeTab = 0;
        });
      }
      $scope.items = items;


      loadAttachments();
    });
  }

  $scope.attachments = [];
  $scope.deleteAttachment = function(item) {
    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Attachment/Delete',
          params: {
            id: item.id
          }
        }).success(function(data) {
          loadAttachments();
        });
      }
    });
  }

  function loadAttachments() {
    $http({
      method: 'GET',
      url: '/Attachment/List',
      params: {
        source_id: id,
        source_name: 'accounting'
      }
    }).success(function(data) {
      $scope.attachments = data || [];
    });
  }

  $scope.$on('ATTACHMENT_MODAL_DONE', function(e) {
    loadAttachments();
  });
};
