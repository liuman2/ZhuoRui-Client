var httpHelper = require('js/utils/httpHelper');

module.exports = function ($scope, $state, $http, $timeout) {
  var module_name = $state.params.module_name,
    sub_id = $state.params.subId || null,
    period = $state.params.period || null,
    id = $state.params.id || null;


  $scope.members = [];
  if (!$scope.members.length) {
    $http({
      method: 'GET',
      url: 'Member/GetAll',
      params: {
        group: '委托事项',
      }
    }).success(function (data) {
      $scope.members = data || [];
    });
  }

  $scope.suppliers = [];
  if (!$scope.suppliers.length) {
    $http({
      method: 'GET',
      url: 'supplier/GetAll',
    }).success(function (data) {
      $scope.suppliers = data || [];
    });
  }

  $scope.getPersonalType = function () {
    switch (module_name) {
      case 'RegInternal':
        return '处理人员';
      case 'Accounting':
        return '会计人员';
        break;
    }
  }

  $scope.getVisible = function () {
    switch (module_name) {
      case 'RegInternal':
      case 'Accounting':
        return true;
      default:
        return false;
    }
  }

  var jForm = $('#audit_pass_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.audit = {
    id: (module_name == 'AuditSub' || module_name == 'Accounting') ? sub_id : id,
    waiter_id: '',
    supplier_id: '',
  }

  if (module_name == 'Accounting') {
    $scope.audit.masterId = $scope.data.id;
    $scope.audit.subId = sub_id;
    $scope.audit.period = period;
    $scope.audit.code = $scope.data.code;
  }

  $scope.save = function () {
    jForm.isValid(function (v) {
      if (v) {
        actionAdd();
      }
    });
  }

  function actionAdd() {
    var url = '';
    switch (module_name) {
      case 'RegInternal':
        url = '/RegInternal/PassAudit';
        break;
      case 'Accounting':
        url = '/Accounting/PassAudit';
        break;
      case 'RegAbroad':
        url = '/RegAbroad/PassAudit';
        break;
      case "Trademark":
        url = '/Trademark/PassAudit';
        break;
      case "Patent":
        url = '/Patent/PassAudit';
        break;
      case "Audit":
        url = '/Audit/PassAudit';
        break;
      case "AuditSub":
        url = '/AuditSub/PassAudit';
        break;
      case "Annual":
        url = '/Annual/PassAudit';
        break;
      case "History":
        url = '/History/PassAudit';
        break;
    }

    $http({
      method: 'POST',
      url: url,
      needLoading: true,
      data: $scope.audit
    }).success(function (data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      $scope.$emit('REFUSE_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
  }
};
