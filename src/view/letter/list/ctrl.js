var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
  var dInput = $('.date-input');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    scrollInput: false,
    // maxDate: new Date(),
    format: 'Y-m-d',
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.search = {
    index: 1,
    size: 20,
    title: '',
    form: '',
    type: '寄件',
    start_time: '',
    end_time: ''
  }

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

  function load_data() {
    $scope.search.start_time = $('#start_time').val();
    $scope.search.end_time = $('#end_time').val();

    $http({
      method: 'GET',
      url: '/Letter/Search',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
