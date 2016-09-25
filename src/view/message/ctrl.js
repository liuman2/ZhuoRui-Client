var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = [];

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.hasRead = function(id) {
        $http({
            method: 'GET',
            url: '/Home/HasRead',
            params: {
                id: id
            }
        }).success(function(data) {
            load_data();
            $scope.$emit('HAS_READ');
        });
    }

    function load_data() {
        $http({
            method: 'GET',
            url: '/Home/Waitdeal'
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
