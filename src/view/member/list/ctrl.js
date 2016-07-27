module.exports = function($scope, $http, $state, $stateParams) {
    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 10,
            total_page: 0,
            total_size: 0
        }
    };

    function load_data() {
        $http({
            method: 'GET',
            params: {
                pageIndex: 1,
                pageSize: 10,
                name: ''
            },
            url: '/Member/List'
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    load_data();
}
