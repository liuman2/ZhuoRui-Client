module.exports = function($scope, $state, $http, $timeout) {
    var id =  $state.params.id || null;

    var jForm = $('#bank_modal_1');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.data = {
        id: null,
        name: '',
        account: '',
        owner: ''
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

    $scope.title = !!id ? '修改开户行' : '添加开户行'
    if (id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Bank/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Bank/Add',
            needLoading: true,
            data: $scope.data
        }).success(function(data) {
            $scope.$emit('COMPANY_BANK_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Bank/Update',
            needLoading: true,
            data: $scope.data
        }).success(function(data) {
            $scope.$emit('COMPANY_BANK_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }
};
