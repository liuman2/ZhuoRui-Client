var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout, $cookieStore) {

  var id = $state.params.id || null;

  $scope.module = {
    id: '',
    source_id: '',
    change_id: id,
    name: '',
    code: ''
  }

  var fields = {};
  $scope.fields = {};

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
    // $state.go("abroad_edit", {
    //     id: id
    // });
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.cancel = function() {
    // $state.go('abroad');
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
          url: '/History/Submit',
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
          url: '/History/PassAudit',
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
    $state.go(".audit", { module_name: 'History' }, { location: false });
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

  $scope.progress = function() {
    if ($scope.data.status == 4) {
      alert('订单已完成，无需再更新进度');
      return;
    }

    if ($scope.data.status < 3) {
      alert('提交人还未提交该订单，无法更新进度');
      return;
    }

    if ($scope.data.review_status != 1) {
      alert('订单未通过审核，无法更新进度');
      return;
    }

    $state.go(".progress", { id: $scope.data.id, module_name: 'History' }, { location: false });
  }

  $scope.printReceipt = function() {
    $state.go(".receipt", { source_name: 'history' }, { location: false });
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

  function setModuleInfo(data) {

    $scope.module.source_id = data.source_id;
    $scope.module.code = data.order_code;
    switch (data.source) {
      case 'reg_abroad':
        $scope.module.id = 'abroad';
        $scope.module.name = '境外注册';

        fields = {
          name_cn: '公司中文名称',
          name_en: '公司英文名称',
          address: '公司注册地址',
          reg_no: '公司注册编号',
          director: '公司董事',
          others: '其他变更'
        };
        break;
      case 'reg_internal':
        $scope.module.id = 'internal';
        $scope.module.name = '境内注册';

        fields = {
          name_cn: '公司中文名称',
          reg_no: '公司注册编号',
          address: '公司注册地址',
          legal: '公司法人',
          director: '公司监事',
          others: '其他变更'
        };
        break;
      case 'trademark':
        $scope.module.id = 'trademark';
        $scope.module.name = '商标注册';

        fields = {
          applicant: '申请人',
          address: '申请人地址',
          trademark_type: '商标类别',
          region: '商标注册地区',
          reg_mode: '注册方式',
          others: '其他变更'
        };
        break;
      case 'patent':
        $scope.module.id = 'patent';
        $scope.module.name = '专利注册';

        fields = {
          applicant: '申请人',
          address: '申请人地址',
          card_no: '申请人证件号码',
          designer: '专利设计人',
          patent_type: '专利类型',
          patent_purpose: '专利用途',
          reg_mode: '注册方式',
          others: '其他变更'
        };
        break;
    }

    angular.copy(fields, $scope.fields);
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/History/GetView',
      params: {
        id: id
      }
    }).success(function(data) {
      console.log(data);
      data.order.fields = JSON.parse(data.order.value);
      $scope.data = data.order;
      $scope.incomes = data.incomes;

      setModuleInfo(data.order);
    });
  }
};
