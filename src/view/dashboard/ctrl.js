module.exports = function($scope, $state, $http, $q, $timeout) {

  $scope.banner = {
    customers: 0,
    annuals: 0
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
