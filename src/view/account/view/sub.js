var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var master_id = $state.params.id || null,
    sub_id = $state.params.sub_id || null,
    dInput = $('.date-input');

  var user = $cookieStore.get('USER_INFO');

  var jForm = $('#accounting_sub_modal');
  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {
      date_start: {
        rule: "起始日:match[lt, date_end, date];required"
      },
      date_end: {
        rule: "结束日:match:match[gt, date_start, date];required"
      }
    }
  });

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.action = null;
  switch ($state.current.name) {
    case 'account_view.addsub':
      $scope.action = 'add';
      $scope.current_bread = '新增账期';
      break;
    case 'account_view.editsub':
      $scope.action = 'update';
      $scope.current_bread = '修改账期';
      break;
    default:
      break;
  }

  $scope.activeTab = 0;
  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
  }

  var user = $cookieStore.get('USER_INFO');
  $scope.subData = {
    id: '',
    date_start: '',
    date_end: '',
    salesman_id: user.id,
  }

  if (sub_id) {
    $scope.subData.id = sub_id;
    console.log($scope.items)

    var items = $scope.items.filter(function(item, i) {
      return item.id == sub_id;
    });

    if (items.length) {
      var item = items[0]
      if (item.date_start && item.date_start.indexOf('T') > -1) {
        item.date_start = item.date_start.split('T')[0];
      }
      if (item.date_end && item.date_end.indexOf('T') > -1) {
        item.date_end = item.date_end.split('T')[0];
      }

      $scope.subData = item;
    }
  }

  function valid_salesman() {
    if (!$scope.subData.salesman_id) {
      jForm.validator('showMsg', '#salesmanSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#salesmanSelect2-validator');
      return true;
    }
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (!v) {
        if (
          !$('select[name="tax"]').isValid() ||
          !$('input[name="date_start"]').isValid() ||
          !$('input[name="date_end"]').isValid() ||
          !$('input[name="amount_transaction"]').isValid()) {

          $scope.activeTab = 0;
          $scope.$apply();
          return;
        }
        if (
          !$('input[name="invoice_bank"]').isValid() ||
          !$('input[name="invoice_account"]').isValid() ||
          !$('input[name="invoice_name"]').isValid() ||
          !$('input[name="invoice_tax"]').isValid() ||
          !$('input[name="invoice_address"]').isValid()) {

          $scope.activeTab = 1;
          $scope.$apply();
          return;
        }
      }

      var isSalesmanVaild = valid_salesman();
      if (!isSalesmanVaild) {
        $scope.activeTab = 2;
        $scope.$apply();
        return;
      }


      if (v) {
        var submitData = angular.copy($scope.subData);

        submitData.date_start = $('#date_start').val();
        submitData.date_end = $('#date_end').val();
        submitData.master_id = master_id;

        submitData.date_transaction = $('#date_transaction').val();

        var url = $scope.action == 'add' ? '/Accounting/AddItem' : '/Accounting/UpdateItem';
        $http({
          method: 'POST',
          url: url,
          data: submitData
        }).success(function(data) {
          $scope.$emit('UPDATE_SUB_DONE');
          $state.go('^', { reload: true });
        });
      }
    });
  }
};
