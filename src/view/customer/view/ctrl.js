module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    if (!!id) {
        $scope.id = id;
        actionView();
    }

    $scope.delete = function(item) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Customer/DeleteBank',
            params: {
                id: item.id
            }
        }).success(function(data) {
            actionView();
        });
    }

    $scope.edit = function() {
        // $state.go('customer_edit({id: ' + id + '})');
        $state.go("customer_edit", {id: id});
    }

    $scope.cancel = function() {
        $state.go('customer');
    }

    $scope.$on('BANK_MODAL_DONE', function(e) {
        actionView();
    });

    function actionView() {
        $http({
            method: 'GET',
            url: '/Customer/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }
};
