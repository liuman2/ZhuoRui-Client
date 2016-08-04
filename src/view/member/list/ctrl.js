module.exports = function($scope, $http, $state, $stateParams) {
    $scope.search = {
        index: 1,
        size: 10,
        name: ""
    }

    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    function load_data() {
        $http({
            method: 'GET',
            params: $scope.search,
            url: '/Member/List'
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    $scope.getStatus = function(status) {
        switch(status) {
            case 0:
                return '离职';
            case 1:
                return '在职';
            case 2:
                return '停薪留职';
        }
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    }

    load_data();
}
