var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
    $scope.search = {
        customer_id: '',
        waiter_id: ''
    }

    $scope.data = {
        items: []
    };

    $scope.query = function() {

        load_data();
    };

    function load_data() {
        $http({
            method: 'GET',
            url: '/Annual/Search',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    // load_data();
}
