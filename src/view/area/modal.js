module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null;

    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.area = {
        id: null,
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

    $scope.title = !!id ? '修改区域' : '添加区域'
    if (id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Area/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data)
            $scope.area = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Area/Add',
            needLoading: true,
            data: $scope.area
        }).success(function(data) {
            $scope.$emit('AREA_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Area/Update',
            needLoading: true,
            data: $scope.area
        }).success(function(data) {
            $scope.$emit('AREA_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
