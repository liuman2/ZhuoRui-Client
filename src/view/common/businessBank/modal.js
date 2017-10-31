module.exports = function($scope, $state, $http, $timeout) {
  var customer_id = $state.params.customer_id,
    tid = $state.params.tid,
    module_name = $state.params.module_name || null,
    dInput = $('.date-input'),
    source_id = $state.params.order_id || null;

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    maxDate: new Date(),
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

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
    manager_id: '',
    tel: '',
    date_setup: '',
    memo: '',
    is_audit: 0,
    audit_id: null,
  }

  $scope.banks = [];

  $http({
    method: 'GET',
    url: '/BusinessBank/All',
  }).success(function(data) {
    $scope.banks = data || [];
  });

  $scope.bankChange = function() {
    if (!$scope.data.bank_id) {
      $scope.contacts = [];
      $scope.data.manager = '';
      return;
    }

    var arrs = $scope.banks.filter(function(item, i) {
      return item.id == $scope.data.bank_id;
    });
    if (arrs.length) {
      $scope.data.address = arrs[0].address;
    }

    $http({
      method: 'GET',
      url: '/BusinessBank/GetContactByBankId',
      params: {
        bankId: $scope.data.bank_id
      }
    }).success(function(data) {
      $scope.contacts = data || [];
    });
  }

  $scope.contactChange = function() {
    if (!$scope.data.manager_id) {
      return;
    }
    $scope.contacts = $scope.contacts || [];
    if (!$scope.contacts.length) {
      return;
    }

    var arrs = $scope.contacts.filter(function(item, i) {
      return item.id == $scope.data.manager_id;
    });
    if (!arrs.length) {
      return;
    }

    $scope.data.tel = arrs[0].tel;
    $scope.data.email = arrs[0].email;
  }

  $scope.save = function() {
    $scope.data.date_setup = $('#date_setup').val();

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
