var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {

    $scope.search = {
        customer_id: '',
        waiter_id: ''/*,
        salesman_id: ''*/
    }

    $scope.data = {
        items: []
    };

    $scope.query = function() {

        load_data();
    };

    $scope.new_annual = function(item) {
        console.log(item);

        $state.go("annual_add", {order_type: item.order_type, order_id: item.id});
    };

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    function load_data() {
        $http({
            method: 'GET',
            url: '/Annual/Warning',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
