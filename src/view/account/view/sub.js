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
  $scope.subData = {
    id: '',
    date_start: '',
    date_end: '',
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

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        var submitData = angular.copy($scope.subData);
        submitData.date_start = $('#date_start').val();
        submitData.date_end = $('#date_end').val();
        submitData.master_id = master_id;

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
