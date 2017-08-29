module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null;

    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.dictionary = {
        id: null,
        group: $state.params['group'],
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
    console.log($scope.dictionary.group)
    $scope.title = !!id ? ($scope.dictionary.group + '-修改') : ($scope.dictionary.group + '-添加');
    if (id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Dictionary/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.dictionary = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Dictionary/Add',
            needLoading: true,
            data: $scope.dictionary
        }).success(function(data) {
            $scope.$emit('DICT_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Dictionary/Update',
            needLoading: true,
            data: $scope.dictionary
        }).success(function(data) {
            $scope.$emit('DICT_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
