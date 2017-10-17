module.exports = function($scope, $state, $http, $timeout) {
  var customer_id = $state.params.customer_id,
    tid = $state.params.tid,
    module_name = $state.params.module_name || null,
    source_id = $state.params.order_id || null;

  var jForm = $('#bank_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.data = {
    id: null,
    customer_id: customer_id,
    source_id: source_id,
    source: module_name,
    name: '',
    address: '',
    manager: '',
    tel: '',
    date_setup: '',
    memo: '',
    is_audit: 0,
    audit_id: null,
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        if (tid) {
          actionUpdate();
        } else {
          actionAdd();
        }
      }
    });
  }

  $scope.title = !!tid ? '修改开户行' : '添加开户行'
  if (tid) {
    actionView();
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Customer/Bank',
      params: {
        id: tid
      }
    }).success(function(data) {
      $scope.data = data;
    });
  }

  function actionAdd() {
    $http({
      method: 'POST',
      url: '/BusinessBank/Add',
      needLoading: true,
      data: $scope.data
    }).success(function(data) {
      $.alert({
        title: false,
        content: '添加成功',
        confirmButton: '确定'
      });
      $state.go('^', { reload: true });
    });
  }

  function actionUpdate() {
    $http({
      method: 'POST',
      url: '/BusinessBank/Update',
      needLoading: true,
      data: $scope.data
    }).success(function(data) {
      $.alert({
        title: false,
        content: '修改成功',
        confirmButton: '确定'
      });
      $state.go('^', { reload: true });
    });
  }
};
