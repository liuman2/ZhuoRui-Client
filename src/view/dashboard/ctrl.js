var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $q, $timeout) {

  $scope.banner = {
    customers: 0,
    annuals: 0
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $http({
    method: 'GET',
    url: '/Home/DashboardInfo'
  }).success(function(data) {
    $scope.banner = data.banner;
    $scope.recently_customers = data.customers || [];
  });

  $http({
      method: 'GET',
      url: '/Notice/GetTop3'
  }).success(function(data) {
      console.log(data)
      $scope.sinpleNotices = data;
  });
};
