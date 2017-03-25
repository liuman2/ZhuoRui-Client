var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

  var id = $state.params.id || null;

  if (!!id) {
    $scope.id = id;
    actionView();
  }
  $scope.data = {
    status: 0,
    review_status: -1
  }

  $scope.subs = [];

  $scope.getYearEnd = function(v) {
    if (v) {
      var vs = v.split('-');
      return vs[0] + '月' + vs[1] + '日';
    }
    return '';
  }
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

  $scope.deleteBank = function(item) {
    if ($scope.data.status > 0) {
      $.alert({
        title: false,
        content: '已提交审核不能移除',
        confirmButton: '确定'
      });
      return;
    }

    if ($scope.data.status == 4) {
      $.alert({
        title: false,
        content: '订单已完成不能移除',
        confirmButton: '确定'
      });
      return;
    }

    if ($scope.data.review_status == 1) {
      var msg = $scope.data.status == 2 ? '已通过财务审核不能移除' : '已通过提交人审核不能移除';
      $.alert({
        title: false,
        content: msg,
        confirmButton: '确定'
      });
      return;
    }

    $.confirm({
      title: false,
      content: '您确认要移除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Audit/DeleteBank',
          params: {
            id: item.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.incomes = {
    items: [],
    total: 0,
    balance: 0
  };

  $scope.edit = function() {
    $state.go("audit_edit", {
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
    $state.go('audit');
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
          url: '/Audit/Submit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.submitSubAudit = function(sub_id) {
    $.confirm({
      title: false,
      content: '您确认要提交审核？提交后不可再编辑',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/AuditSub/Submit',
          params: {
            id: sub_id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.getDisabled = function() {
    if (!$scope.subs.length) {
      return $scope.data.status < 3;
    }

    return $scope.subs[$scope.subs.length - 1].status < 3;
  }

  $scope.passAudit = function() {
    $.confirm({
      title: false,
      content: '您确认通过审核？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Audit/PassAudit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.passSubAudit = function(sub_id) {
    $.confirm({
      title: false,
      content: '您确认通过审核？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/AuditSub/PassAudit',
          params: {
            id: sub_id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'Audit' }, { location: false });
  }

  $scope.refuseSubAudit = function(sub_id) {
    $state.go(".subaudit", { module_name: 'AuditSub', subId: sub_id}, { location: false });
  }

  $scope.done = function() {
    $state.go(".done", { module_name: 'Audit' }, { location: false });
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

  $scope.getSubOrderStatus = function(sub) {
    switch (sub.status) {
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
  $scope.getSubReviewStatus = function(item) {
    switch (item.review_status) {
      case -1:
        return '未审核';
      case 0:
        return '驳回';
      case 1:
        return '审核通过';
    }
  }

  $scope.progress = function(t) {
    // if ($scope.data.status == 4) {
    //     alert('订单已完成，无需再更新进度');
    //     return;
    // }

    if ($scope.data.status < 3) {
      $.alert({
        title: false,
        content: t == 'p' ? '提交人还未提交该订单，无法更新进度' : '提交人还未提交该订单，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    if ($scope.data.review_status != 1) {
      $.alert({
        title: false,
        content: t == 'p' ? '订单未通过审核，无法更新进度' : '订单未通过审核，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".progress", { id: $scope.data.id, module_name: 'Audit', type: t }, { location: false });
  }

  $scope.progressSub = function(t, sub) {
    // if ($scope.data.status == 4) {
    //     alert('订单已完成，无需再更新进度');
    //     return;
    // }

    if (sub.status < 3) {
      $.alert({
        title: false,
        content: t == 'p' ? '提交人还未提交该订单，无法更新进度' : '提交人还未提交该订单，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    if (sub.review_status != 1) {
      $.alert({
        title: false,
        content: t == 'p' ? '订单未通过审核，无法更新进度' : '订单未通过审核，无法完善注册资料',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".progressSub", { subId: sub.id, module_name: 'AuditSub', type: t }, { location: false });
  }

  $scope.expandSub = function(item, e) {
    if ($(e.target).closest('i').attr('class').indexOf('fa-plus') < 0) {
      return;
    }
    // if (item.incomes != undefined) {
    //   return;
    // }

    $http({
      method: 'GET',
      url: '/AuditSub/GetIncomes',
      params: {
        id: item.id
      }
    }).success(function(data) {
      item.incomes = data || {};
    });
  }

  $scope.printReceipt = function(t) {
    $state.go(".receipt", { type: t, source_name: 'audit' }, { location: false });
  }

  $scope.printReceiptSub = function(t, item) {
    $state.go(".receipt_sub", { type: t, source_name: 'sub_audit', subId: item.id }, { location: false });
  }

  $scope.$on('PROGRESS_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('INCOME_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('REFUSE_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('FINISH_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.$on('AUDIT_BANK_DONE', function(e) {
    actionView();
  });

  function actionView() {
    $http({
      method: 'GET',
      url: '/Audit/GetView',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.data = data.order;
      $scope.incomes = data.incomes;
      $scope.banks = data.banks;
      $scope.subs = data.subs;
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
        source_name: 'audit'
      }
    }).success(function(data) {
      $scope.attachments = data || [];
    });
  }

  $scope.$on('ATTACHMENT_MODAL_DONE', function(e) {
    loadAttachments();
  });
};
