var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    $scope.search = {
        index: 1,
        size: 20,
        id: id
    }

    if (!!id) {
        $scope.id = id;
        actionView();
        getCustomers();
    }

    $scope.data = {}

    $scope.customers = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    $scope.edit = function() {
        $state.go("abroad_edit", {
            id: id
        });
    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }


    $scope.$on('CUSTOMER_MODAL_DONE', function(e) {
        getCustomers();
    });

    $scope.go = function(index) {
        $scope.search.index = index;
        getCustomers();
    };

    $scope.deleteCustomer = function(item) {
        $http({
            method: 'GET',
            url: '/Lecture/DeleteLeactureCustomer',
            params: {
                leactureId: id,
                customerId: item.customer_id
            }
        }).success(function(data) {
            getCustomers();
        });
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Lecture/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    function getCustomers() {
        $http({
            method: 'GET',
            url: '/Lecture/GetDetails',
            params: $scope.search
        }).success(function(data) {
            $scope.customers = data;
        });
    }
};
