module.exports = function($scope, $state, $http, $q, $timeout) {

    $scope.banner = {
        customers: 0,
        annuals:0
    }

    $http({
        method: 'GET',
        url: '/Home/Banner'
    }).success(function(data) {
        $scope.banner = data;
    });

    $http({
        method: 'GET',
        url: '/Home/GetRecentlyCustomer'
    }).success(function(data) {
        $scope.recently_customers = data || [];
    });
};