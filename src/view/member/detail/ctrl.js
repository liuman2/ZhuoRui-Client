module.exports = function($scope, $state, $stateParams, $element, $http) {
    $scope.action = null;
    var id = $state.params.id || null;

    switch ($state.current.name) {
        case 'member.detail.add':
            $scope.action = 'add';
            $scope.editable = true;
            $scope.current_bread = '新增';
            break;
        case 'member.detail.edit':
            $scope.action = 'update';
            $scope.editable = true;
            $scope.current_bread = '修改';
            break;
        case 'member.detail.view':
            $scope.action = 'view';
            $scope.editable = false;
            $scope.current_bread = '查看';
            break;
        default:
            break;
    }

};
