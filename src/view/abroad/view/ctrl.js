module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    if (!!id) {
        $scope.id = id;
        actionView();
    }

    // $scope.delete = function(item) {
    //     if (!confirm('您确认要删除吗？')) {
    //         return false;
    //     }

    //     $http({
    //         method: 'GET',
    //         url: '/Customer/DeleteBank',
    //         params: {
    //             id: item.id
    //         }
    //     }).success(function(data) {
    //         actionView();
    //     });
    // }

    $scope.incomes = {
        items: [],
        total: 0,
        balance: 0
    };

    $scope.edit = function() {
        // $state.go('customer_edit({id: ' + id + '})');
        $state.go("abroad_edit", {
            id: id
        });
    }

    $scope.cancel = function() {
        $state.go('abroad');
    }

    $scope.$on('INCOME_MODAL_DONE', function(e) {
        actionView();
    });

    function actionView() {
        $http({
            method: 'GET',
            url: '/RegAbroad/GetView',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data);
            $scope.data = data.order;
            $scope.incomes = data.incomes;
        });
    }
};
