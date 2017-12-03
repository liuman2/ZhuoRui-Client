module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null;

    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.supplier = {
        id: null,
        name: ''
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
    if (id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Supplier/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.supplier = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/supplier/Add',
            needLoading: true,
            data: $scope.supplier
        }).success(function(data) {
            $scope.$emit('SUP_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
