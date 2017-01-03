var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
  $.datetimepicker.setLocale('ch');
  var dInput = $('.date-input');

  dInput.datetimepicker({
    timepicker: false,
    maxDate: new Date(),
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.search = {
    index: 1,
    size: 20,
    member_id: '',
    type: '',
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
    /*if (!$scope.search.member_id) {
      $.alert({
        title: false,
        content: '请选择人员',
        confirmButton: '确定'
      });
      return;
    }*/
    load_data();
  };

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getTypeName = function(type) {
    if (type === 20) {
      return '年假';
    }
    var strs = ['病假', '事假', '婚假', '丧假', '产假', '陪产假'];
    return strs[type - 11];
  }

  $scope.getStatusName = function(status) {
    // 状态 0-带审批，1：通过审批， 2：驳回，-1：作废
    switch(status) {
      case 0:
        return '待审批';
      case 1:
        return '通过';
      case 2:
        return '驳回';
      case -1:
        return '作废';
    }
  }

  function load_data() {

    $scope.search.start_time = $('#start_time').val();
    $scope.search.end_time = $('#end_time').val();

    $http({
      method: 'GET',
      url: '/Leave/Statistics',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }
}
