var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var module_name = $state.params.module_name,
    sub_id = $state.params.subId || null,
    period = $state.params.period || null,
    id = $state.params.id || null;


  var jForm = $('#audit_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.audit = {
    id: (module_name == 'AuditSub' || module_name == 'Accounting') ? sub_id : id,
    description: ''
  }

  if (module_name == 'Accounting') {
    $scope.audit.masterId = $scope.data.id;
    $scope.audit.subId = sub_id;
    $scope.audit.period = period;
    $scope.audit.code= $scope.data.code;
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        actionAdd();
      }
    });
  }

  function actionAdd() {
    $http({
      method: 'POST',
      url: '/' + module_name + '/RefuseAudit',
      needLoading: true,
      data: $scope.audit
    }).success(function(data) {
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
