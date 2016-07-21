module.exports = function($scope, $state, $stateParams, $element, $http) {
    $scope.action = null;
    var id = $state.params.id || null;
    switch ($state.current.name) {
        case 'abroad.detail.add':
            $scope.action = 'add';
            $scope.editable = true;
            $scope.current_bread = '新增';
            break;
        case 'abroad.detail.edit':
            $scope.action = 'update';
            $scope.editable = true;
            $scope.current_bread = '修改';
            break;
        case 'abroad.detail.view':
            $scope.action = 'view';
            $scope.editable = false;
            $scope.current_bread = '查看';
            break;
        default:
            break;
    }

    $scope.cancel = function() {
        $state.go('abroad');
    }

    $scope.save = function() {
        var jForm = $('.form-horizontal');
        jForm.isValid(function(v) {
            if (v) {

            }
        });
    }
};
