module.exports = function($scope, $state, $stateParams, $element, $http) {
    $scope.action = null;
    var id = $state.params.id || null;
    switch ($state.current.name) {
        case 'customer.detail.add':
            $scope.action = 'add';
            $scope.editable = true;
            $scope.current_bread = '新增';
            break;
        case 'customer.detail.edit':
            $scope.action = 'update';
            $scope.editable = true;
            $scope.current_bread = '修改';
            break;
        case 'customer.detail.view':
            $scope.action = 'view';
            $scope.editable = false;
            $scope.current_bread = '查看';
            break;
        default:
            break;
    }

    $scope.cancel = function() {
        $state.go('customer');
    }
};
