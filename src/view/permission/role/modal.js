module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null;

    var jForm = $('#role-form');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.role = {
        id: null,
        is_system: false,
        name: '',
        description: ''
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                if (id) {
                    actionUpdate();
                } else {
                    actionAdd();
                }
            }
        });
    }

    $scope.title = !!id ? '修改角色' : '添加角色'
    if (id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Role/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data)
            $scope.role = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Role/Add',
            needLoading: true,
            data: $scope.role
        }).success(function(data) {
            $scope.$emit('ROLE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Role/Update',
            needLoading: true,
            data: $scope.role
        }).success(function(data) {
            $scope.$emit('ROLE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
