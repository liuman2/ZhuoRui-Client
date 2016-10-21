var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $cookieStore, $stateParams) {
  var dInput = $('.date-input');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    onChangeDateTime: function(current_time, $input) {}
  });

  var user = $cookieStore.get('USER_PROFILE');
  if (!user) {
    location.href = '/login.html';
  }

  $scope.user = user;

  $scope.search = {
    index: 1,
    size: 20,
    type: '',
    status: 0,
    start_time: '',
    end_time: ''
  }

  $scope.data = {
    items: [],
    page: {
      current_index: 0,
      current_size: 0,
      total_page: 0,
      total_size: 0
    }
  };

  $scope.query = function() {
    load_data();
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  };

  $scope.getType = function(type) {
    switch(type) {
      case 11:
        return '病假';
      case 12:
        return '事假';
      case 13:
        return '婚假';
      case 14:
        return '丧假';
      case 15:
        return '产假';
      case 16:
        return '陪产假';
      case 20:
        return '年假';
    }
  }

  $scope.getStatus = function(status) {
    switch(status) {
      case -1:
        return '已作废';
      case 0:
        return '待审批';
      case 1:
        return '已批准';
      case 2:
        return '驳回';
    }
  }

  function load_data() {
    $scope.search.start_time = $('#start_time').val();
    $scope.search.end_time = $('#end_time').val();

    $http({
      method: 'GET',
      url: '/Leave/GetMyAuditLeave',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
