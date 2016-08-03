var dateHelper = require('js/utils/dateHelper');

module.exports = function($scope, $http, $state, $stateParams) {

    $scope.search = {
        userId: $scope.userInfo.id,
        index: 1,
        size: 10,
        name: ""
    }

    $scope.data = [];

    function load_data() {
        console.log($scope.userInfo)
        $http({
            method: 'GET',
            url: '/Reserve/Search',
            params: $scope.search
        }).success(function(data) {
            console.log(data)
            $scope.data = data.items;
        });
    }

    $scope.query = function() {
        load_data();
    }

    load_data();
}
