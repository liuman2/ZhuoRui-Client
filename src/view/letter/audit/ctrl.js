var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
  var dInput = $('.date-input');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    // maxDate: new Date(),
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.getTitle = function(item, i) {
    if (item.review_status == -1) {
      $('#tool-tip' + i).tooltipster({
        theme: 'tooltipster-sideTip-shadow',
        content: item.review_moment,
      });

      return item.review_moment;
    }
    return '';
  }

  $scope.getOrderType = function(source) {
    switch (source) {
      case 'reg_abroad':
        return '境外注册';
      case 'reg_internal':
        return '境内注册';
      case 'audit':
        return '审计';
      case 'trademark':
        return '商标';
      case 'patent':
        return '专利';
    }
  }

  $scope.getStatus = function(item) {
    switch (item.review_status) {
      case 0:
        return '未审核';
      case 1:
        return '已审核';
      case -1:
        return '驳回';
    }
  }

  $scope.query = function() {
    load_data();
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.audit = function(item) {
    if (item.type == '收件') {
      $state.go("inbox_view", {
        id: item.id
      });
    } else {
      $state.go("letter_view", {
        id: item.id
      });
    }
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/Letter/GetLetterForAudit'
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
