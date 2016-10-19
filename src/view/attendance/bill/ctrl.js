var httpHelper = require('js/utils/httpHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  $.datetimepicker.setLocale('ch');
  var dInput = $('.date-input');
  var jForm = $('#leave_form');

  dInput.datetimepicker({
    timepicker: true,
    step: 5,
    format: 'Y-m-d H:i',
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {
      date_start: {
        rule: "开始日期:match[lte, date_end, date];required;"
      },
      date_end: {
        rule: "结束日期:match[gte, date_start, date];required;"
      }
    }
  });

  var user = $cookieStore.get('USER_PROFILE');
  if (!user) {
    location.href = '/login.html';
  }

  $scope.user = user;
  $scope.user.today = moment(new Date()).format('YYYY-MM-DD');

  function initData() {
    $scope.data = {
      owner_id: user.id,
      type: null,
      date_start: null,
      date_end: null,
      reason: null,
      memo: null,
      receiver_id: null,
      tel: null,
      auditor_id: null
    }
  }

  initData();

  $scope.save = function() {
    var isReceiverVaild = valid_receiver();
    var isAuditorVaild = valid_auditor();
    jForm.isValid(function(v) {
      if (v) {
        if (!isReceiverVaild || !isAuditorVaild) {
          return;
        }

        var submitData = angular.copy($scope.data);

        submitData.date_start = $('#date_start').val();
        submitData.date_end = $('#date_end').val();

        $http({
          method: 'POST',
          url: '/Leave/Add',
          data: submitData
        }).success(function(data) {
          initData();
        });
      }
    });
  }

  function valid_receiver() {
    if (!$scope.data.receiver_id) {
      jForm.validator('showMsg', '#receiverSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#receiverSelect2-validator');
      return true;
    }
  }

  function valid_auditor() {
    if (!$scope.data.auditor_id) {
      jForm.validator('showMsg', '#auditorSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#auditorSelect2-validator');
      return true;
    }
  }
};
