var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  console.log($scope.schedule)
  var dInput = $('.date-input'),
    scheduleForm = $('#schedule_modal');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: true,
    step: 5,
    format: 'Y-m-d H:i',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {}
  });

  $scope.eventTilte = '添加日程';

  if ($scope.schedule.id) {
    $scope.eventTilte = $scope.schedule.editable ? '修改日程' : '查看日程';
  }

  function valid_people() {
    if ($scope.schedule.type != 1) {
      $('#rowpeople').find('.n-error').remove();
      scheduleForm.validator('hideMsg', '#peopleSelect2-validator');
      return true;
    }
    if (!$('#joinPeople').val() || $('#joinPeople').val().indexOf('?') >= 0) {
      scheduleForm.validator('showMsg', '#peopleSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      scheduleForm.validator('hideMsg', '#peopleSelect2-validator');
      return true;
    }
  }

  function valid_color() {
    if (!$('#select2Color').val() || $('#select2Color').val().indexOf('?') >= 0) {
      scheduleForm.validator('showMsg', '#select2Color-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      scheduleForm.validator('hideMsg', '#select2Color-validator');
      return true;
    }
  }

  $scope.save = function() {
    scheduleForm.isValid(function(v) {
      var isPeopleValid = valid_people();
      var isColorValid = valid_color();
      $('#rowpeople').find('.n-error').remove();
      var errorLength = scheduleForm.find('.n-error').length;
      if (errorLength == 0 && isPeopleValid && isColorValid) {
        var submitData = angular.copy($scope.schedule);

        submitData.people = null;
        if (submitData.type == 1) {
          submitData.people = $('#joinPeople').val().join(',');
        }
        submitData.color = $('#select2Color').val();

        $http({
          method: 'POST',
          url: submitData.id > 0 ? '/Schedule/Update' : '/Schedule/Add',
          data: submitData
        }).success(function(data) {
          $scope.$emit('EVENT_MODAL_DONE');
          $state.go('^', {
            reload: true
          });
        });
      }
    });
  }

  $scope.delete = function() {
    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Schedule/Delete',
          params: {
            id: $scope.schedule.id
          }
        }).success(function(data) {
          $scope.$emit('EVENT_MODAL_DONE');
          $state.go('^', {
            reload: true
          });
        });
      }
    });
  }

  scheduleForm.validator({
    rules: {},
    fields: {
      schedule_start: "开始时间:match[lte, schedule_end, date];",
      schedule_end: "结束时间:match[gte, schedule_start, date];"
    }
  });

  function formatState(state) {
    if (!state.id) {
      return state.text;
    }
    var cls = '';
    switch (state.id) {
      case '#51B749':
        cls = 'color-1'
        break;
      case '#DC2127':
        cls = 'color-2'
        break;
      case '#DBADFF':
        cls = 'color-3'
        break;
      case '#5484ED':
        cls = 'color-4'
        break;
    }
    var $state = $(
      '<span class="period-color"><span class="' + cls + '"></span>' + state.text + '</span>'
    );
    return $state;
  };

  function initColor() {
    $('#select2Color').select2({
      language: "zh-CN",
      placeholder: "请选择",
      data: [{
        id: '#51B749',
        text: '重要但不紧急'
      }, {
        id: '#DC2127',
        text: '重要且紧急'
      }, {
        id: '#DBADFF',
        text: '不重要但紧急'
      }, {
        id: '#5484ED',
        text: '不重要不紧急'
      }],
      templateResult: formatState,
      templateSelection: formatState
    });

    if ($scope.schedule.id) {
      $timeout(function() {
        $("#select2Color").val($scope.schedule.color).trigger("change");
      }, 400);
    }
  }

  initColor();

  function getMember() {
    $('#joinPeople').select2({
      language: "zh-CN",
      placeholder: "",
      maximumSelectionSize: 8,
      data: $scope.memberList || []
    });

    if ($scope.schedule.id && $scope.schedule.type == 1) {
      var peoples = $scope.schedule.people.split(',');
      $("#joinPeople").val(peoples).trigger("change");
    }
  }
  getMember();
};
