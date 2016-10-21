var httpHelper = require('js/utils/httpHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {

  var id = $state.params.id || null;

  var user = $cookieStore.get('USER_PROFILE');
  if (!user) {
    location.href = '/login.html';
  }

  $scope.user = user;

  $scope.diffDay = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  $scope.getStatus = function(status) {
    switch (status) {
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

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

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

  if (!!id) {
    actionView();
  }

  $scope.abandon = function() {
    $.confirm({
      title: false,
      content: '您确认要作废吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Leave/Abandon',
          params: {
            id: id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Leave/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      console.log(data);
      $scope.data = data;
      diffDays();
    });
  }

  function diffDays() {
    var start = $scope.data.date_start;
    var end = $scope.data.date_end;
    if (!start || !end) {
      return;
    }

    start = start.replace(/-/g, "/").replace('T', ' ');
    end = end.replace(/-/g, "/").replace('T', ' ');

    var startTime = new Date(start).getTime();
    var endTime = new Date(end).getTime();

    var diffTime = endTime - startTime;

    //计算出相差天数
    var days = Math.floor(diffTime / (24 * 3600 * 1000));

    //计算出小时数
    var leave1 = diffTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    $scope.diffDay.days = days;
    $scope.diffDay.hours = hours;
    $scope.diffDay.minutes = minutes;
    $scope.diffDay.seconds = seconds;
  }
};
