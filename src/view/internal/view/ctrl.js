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
  $scope.priceList = [];
  $scope.basePrice = {
    id: '',
    items: []
  };
  $scope.hasBase = false;
  $scope.activeTab = 0;

  $scope.holderViewHistory = false;
  $scope.historyShareholder = [];

  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
  }

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

  $scope.getTotal = function() {
    var total = 0;
    if ($scope.priceList.length > 0) {
      $.each($scope.priceList, function(i, p) {
        total += (p.price - 0);
      })
    }

    return total;
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

  $scope.getTrueOrFalse = function(isBool) {
    if (isBool === null) {
      return '-';
    }
    return isBool === 1 ? '是' : '否';
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

  $scope.feedback = function() {
    $state.go(".feedback", null, { location: false });
  }

  $scope.incomes = {
    items: [],
    total: 0,
    balance: 0
  };

  $scope.edit = function() {
    $state.go("internal_edit", {
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
    $state.go('internal');
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
          url: '/Reginternal/Submit',
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
          url: '/RegInternal/PassAudit',
          params: {
            id: $scope.data.id,
            waiter_id: 0,
            supplier_id: 0,
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  $scope.passAudit = function() {
    $state.go(".pass", { module_name: 'RegInternal' }, { location: false });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'RegInternal' }, { location: false });
  }

  $scope.done = function() {
    $state.go(".done", { module_name: 'RegInternal' }, { location: false });
  }
  $scope.$on('CREATOR_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.getHistoryTitle = function(key) {
    var titleInfo = '无变更记录'
    if ($scope.historyRecord[key]) {
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

    return '';
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

  $scope.$on('ITEM_FINISH_DONE', function(e, result) {
    console.log(result);
    $scope.priceList[result.index] = result.price;
  });

  $scope.$on('BASE_ITEM_FINISH_DONE', function(e, result) {
    console.log(result);
    $scope.basePrice.items[result.index] = result.price;
  });


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

    $state.go(".progress", { id: $scope.data.id, module_name: 'RegInternal', type: t }, { location: false });
  }

  $scope.printReceipt = function(t) {
    $state.go(".receipt", { type: t, source_name: 'reg_internal' }, { location: false });
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

  function actionView() {
    $http({
      method: 'GET',
      url: '/RegInternal/GetView',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.historyRecord = data.historyReocrd;

      data.order.names = data.order.names || '';
      if (data.order.names.length) {
        data.order.nameList = JSON.parse(data.order.names);
      }
      data.items = data.items || [];
      if (data.items.length) {
        var arrs = data.items.filter(function(item, i) {
          return item.name == '公司基础注册';
        });
        if (arrs.length > 0) {
          $scope.hasBase = true;

          var str = arrs[0].sub_items || '';
          if (str.length) {
            $scope.basePrice = {
              id: arrs[0].id,
              items: JSON.parse(str)
            };
          } else {
            $scope.basePrice = {
              id: arrs[0].id,
              items: [/*{
                name: '确认注册信息',
                finisher: '',
                status: 0,
                date_finished: '',
              },*/{
                name: '名称预核准',
                finisher: '',
                status: 0,
                date_started: '',
                date_finished: '',
              },{
                name: '网上设立申请',
                finisher: '',
                status: 0,
                date_started: '',
                date_finished: '',
              },{
                name: '办理营业执照',
                finisher: '',
                status: 0,
                date_started: '',
                date_finished: '',
              },{
                name: '刻制企业印章',
                finisher: '',
                status: 0,
                date_started: '',
                date_finished: '',
              },{
                name: '开立银行基本户',
                finisher: '',
                status: 0,
                date_started: '',
                date_finished: '',
              }]
            };
          }
        }

        // var arr1 = data.items.filter(function(item, i) {
        //   return item.name != '公司基础注册';
        // });

        $scope.priceList = data.items || [];
      }

      data.order.name_cn = data.order.name_cn || '';
      $scope.data = data.order;
      $scope.data.shareholderList = data.shareholderList || [];
      $scope.incomes = data.incomes;

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

  $scope.getHolderHistory = function(type) {
    if (type == '股东' && $scope.holderViewHistory) {
      $scope.holderViewHistory = false;
      return;
    }

    $http({
      method: 'GET',
      url: '/RegInternal/HistoryHolder',
      params: {
        master_id: id,
        source: 'reg_internal',
        type: type,//'股东'
      }
    }).success(function(data) {
      $scope.historyShareholder = data || [];
      $scope.holderViewHistory = true;
    });
  }

  function loadAttachments() {
    $http({
      method: 'GET',
      url: '/Attachment/List',
      params: {
        source_id: id,
        source_name: 'reg_internal'
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
        return '正常';
      case 1:
        return '转秘书(转出)';
      case 2:
        return '注销';
    }
  }
};
