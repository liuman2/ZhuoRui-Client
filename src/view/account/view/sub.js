var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var master_id = $state.params.id || null,
    sub_id = $state.params.sub_id || null,
    dInput = $('.date-input');

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

  var user = $cookieStore.get('USER_INFO');
  $scope.data = {
    id: '',
    date_start: '',
    date_end: '',
  }

  if (sub_id) {
    $scope.data.id = sub_id;
    actionView();
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        var submitData = angular.copy($scope.data);
        submitData.date_start = $('#date_start').val();
        submitData.date_end = $('#date_end').val();
        submitData.master_id = master_id;

        var url = $scope.action == 'add' ? '/Accounting/AddItem' : '/Accounting/UpdateItem';
        $http({
          method: 'POST',
          url: url,
          data: submitData
        }).success(function(data) {
          $scope.$emit('AUDIT_BANK_DONE');
          $state.go('^', { reload: true });
        });
      }
    });
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/AuditSub/Get',
      params: {
        id: sub_id
      }
    }).success(function(data) {
      if (data.date_transaction && data.date_transaction.indexOf('T') > -1) {
        data.date_transaction = data.date_transaction.split('T')[0];
      }
      if (data.account_period && data.account_period.indexOf('T') > -1) {
        data.account_period = data.account_period.split('T')[0];
      }
      if (data.account_period2 && data.account_period2.indexOf('T') > -1) {
        data.account_period2 = data.account_period2.split('T')[0];
      }

      if (data.date_year_end && data.date_year_end.indexOf('-') > -1) {
        data.date_month_end = data.date_year_end.split('-')[0];
        data.date_day_end = data.date_year_end.split('-')[1];
      }

      $scope.data = data;
    });
  }
};
