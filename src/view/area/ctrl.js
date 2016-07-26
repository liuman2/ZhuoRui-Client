module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = [];

    function load_data() {
        $http({
            method: 'GET',
            url: '/Area/List'
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
