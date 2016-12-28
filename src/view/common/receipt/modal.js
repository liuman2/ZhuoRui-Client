var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var source_id = $state.params.id,
    type = $state.params.type,
    source_name = $state.params.source_name;

  if (source_name == 'sub_audit') {
    source_id = $state.params.subId;
  }

  var jForm = $('#receipt_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.formType = type;
  $scope.data = {
    id: null,
    order_id: source_id,
    order_source: source_name,
    memo: ''
  }

  $scope.save = function(e) {
    if (!$('#receipt_memo').val() || $('#receipt_memo').val().indexOf('undefined') > -1 || $('#receipt_memo').val().indexOf('? string:') > -1) {
      $.alert({
        title: false,
        content: '请输入收款事由',
        confirmButton: '确定'
      });
      return;
    }

    if (type == 'print') {
      window.open('/print.html?t=receipt&m=' + source_name + '&id=' + source_id, '_blank');
    }

    $scope.data.memo = $('#receipt_memo').val();
    $http({
      method: 'POST',
      url: !!$scope.data.id ? '/Receipt/Update' : '/Receipt/Add',
      data: $scope.data
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      $scope.$emit('INCOME_MODAL_DONE');

      // $(e.target).href='http://baidu.com';
      $timeout(function() {
        $state.go('^', {
          reload: true
        });
      }, 500);

    });
  }

  actionView();

  function actionView() {
    $http({
      method: 'GET',
      url: '/Receipt/Get',
      params: {
        order_id: source_id,
        name: source_name
      }
    }).success(function(data) {
      if (!!data) {
        $scope.data = data
      }
    });
  }
};
