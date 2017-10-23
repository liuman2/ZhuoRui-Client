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

  $scope.activeTab = 0;
  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
  }

  $scope.holderViewHistory = false;
  $scope.directoryViewHistory = false;

  $scope.historyShareholder = [];
  $scope.historyDirectory = [];

  $scope.getChangeName = function(type) {
    switch(type) {
      case 'new':
        return '新进';
      case 'exit':
        return '退出';
      case 'takes':
        return '股份调整';
      default:
        return '';
    }
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

  $scope.incomes = {
    items: [],
    total: 0,
    balance: 0
  };

  $scope.edit = function() {
    $state.go("abroad_edit", {
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
    $state.go('abroad');
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
          url: '/RegAbroad/Submit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
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
          url: '/RegAbroad/PassAudit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'RegAbroad' }, { location: false });
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

  $scope.getHistoryTitle = function(key) {
    var titleInfo = '无变更记录'
    if ($scope.historyRecord && $scope.historyRecord[key]) {
      var titleInfo = $scope.historyRecord[key];
      if ($scope.historyRecord[key].indexOf('|') > -1) {
        var titles = $scope.historyRecord[key].split('|');
        var title1 = '<span style="width: 80px; margin-right: 10px; text-align: right; display: inline-block;">变更前：</span>' + titles[0];
        var title2 = '<span style="width: 80px; margin-right: 10px; text-align: right; display: inline-block;">变更时间：</span>' + titles[1];
        titleInfo = title1 + '</br>' + title2;
      }
    }

    $('.' + key).tooltipster({
      theme: 'tooltipster-sideTip-shadow',
      content: titleInfo,
      contentAsHTML: true
    });
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

    $state.go(".progress", { id: $scope.data.id, module_name: 'RegAbroad', type: t }, { location: false });
  }

  $scope.printReceipt = function(t) {
    $state.go(".receipt", { type: t, source_name: 'reg_abroad' }, { location: false });
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

  $scope.$on('CREATOR_MODAL_DONE', function(e) {
    actionView();
  });

  function actionView() {
    $http({
      method: 'GET',
      url: '/RegAbroad/GetView',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.historyRecord = data.historyReocrd;

      $scope.data = data.order;
      $scope.incomes = data.incomes;
      $scope.data.shareholderList = data.shareholderList || [];
      $scope.data.directorList = data.directorList || [];
      $scope.banks = data.banks;
      loadAttachments();

      if (data.historyReocrd) {
        for (var key in data.historyReocrd) {
          $scope.getHistoryTitle(key);
        }
      }
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

  $scope.updateBank = function(item) {
    // $state.go(".bank", { order_id: item.id, module_name: 'reg_abroad', customer_id: item.customer_id }, { location: false });
  }

  $scope.getHolderHistory = function(type) {
    if (type == '股东' && $scope.holderViewHistory) {
      $scope.holderViewHistory = false;
      return;
    }
    if (type == '董事' && $scope.directoryViewHistory) {
      $scope.directoryViewHistory = false;
      return;
    }

    $http({
      method: 'GET',
      url: '/RegAbroad/HistoryHolder',
      params: {
        master_id: id,
        source: 'reg_abroad',
        type: type,//'股东'
      }
    }).success(function(data) {
      if (type == '股东') {
        $scope.historyShareholder = data || [];
        $scope.holderViewHistory = true;
      } else {
        $scope.historyDirectory = data || [];
        $scope.directoryViewHistory = true;
      }

    });
  }

  function loadAttachments() {
    $http({
      method: 'GET',
      url: '/Attachment/List',
      params: {
        source_id: id,
        source_name: 'reg_abroad'
      }
    }).success(function(data) {
      $scope.attachments = data || [];
    });
  }

  $scope.$on('ATTACHMENT_MODAL_DONE', function(e) {
    loadAttachments();
  });

  $scope.getOrderAnnType = function(status) {
    var statusName = status - 0;
    switch(statusName) {
      case 0:
        return '正常年检';
      case 1:
        return '转秘书(转出)';
      case 2:
        return '注销';
      case 3:
        return '暂不年检';
    }
  }
};
