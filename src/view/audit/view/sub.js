var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var master_id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#audit_form');

  var jForm = $('#audit_sub_modal');
  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {
      account_period: {
        rule: "起始日:match[lt, account_period2, date];required"
      },
      account_period2: {
        rule: "结束日:match:match[gt, account_period, date];required"
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
    case 'audit_view.addsub':
      $scope.action = 'add';
      $scope.current_bread = '新增账期';
      break;
    case 'audit_view.editsub':
      $scope.action = 'update';
      $scope.current_bread = '修改账期';
      break;
    default:
      break;
  }

  var user = $cookieStore.get('USER_INFO');
  $scope.data = {
    salesman_id: user.id,
    salesman: user.name,
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        var submitData = angular.copy($scope.data);
        submitData.account_period = $('#account_period').val();
        submitData.account_period2 = $('#account_period2').val();
        if (submitData.date_month_end && submitData.date_day_end) {
          submitData.date_year_end = submitData.date_month_end + '-' + submitData.date_day_end;
        } else {
          submitData.date_year_end = '';
        }
        submitData.date_transaction = $('#date_transaction').val();
        submitData.master_id = master_id;

        var url = $scope.action == 'add' ? '/AuditSub/Add' : '/AuditSub/Update';
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
};
