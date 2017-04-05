var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var module_name = $state.params.module_name,
    sub_id = $state.params.subId || null,
    id = $state.params.id || null;


  $scope.members = [];
  if (!$scope.members.length) {
    $http({
      method: 'GET',
      url: 'Member/GetAll',
      params: {
        group: '委托事项',
      }
    }).success(function(data) {
      $scope.members = data || [];
    });
  }

  var jForm = $('#audit_pass_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.audit = {
    id: module_name == 'AuditSub' ? sub_id : id,
    waiter_id: ''
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
      url: '/RegInternal/PassAudit',
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
