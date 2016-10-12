module.exports = function($scope, $http, $state, $stateParams) {
    $scope.search = {
        index: 1,
        size: 20,
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

    $scope.delete = function (item) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Bank/Delete',
                    params: {
                        id: item.id
                    }
                }).success(function(data) {
                    load_data();
                });
            }
        });
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    }

    $scope.$on('COMPANY_BANK_MODAL_DONE', function(e) {
        load_data();
    });

    function load_data() {
        $http({
            method: 'GET',
            params: $scope.search,
            url: '/Bank/Search'
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    load_data();
}
