module.exports = function($scope, $state, $http, $timeout) {
    var customer_id =  $state.params.id,
        tid = $state.params.tid || null;

    var jForm = $('#bank_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.data = {
        id: null,
        customer_id: customer_id,
        bank: '',
        holder: '',
        account: ''
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                if (tid) {
                    actionUpdate();
                } else {
                    actionAdd();
                }
            }
        });
    }

    $scope.title = !!tid ? '修改开户行' : '添加开户行'
    if (tid) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Customer/Bank',
            params: {
                id: tid
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Customer/AddBank',
            needLoading: true,
            data: $scope.data
        }).success(function(data) {
            $scope.$emit('BANK_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Customer/UpdateBank',
            needLoading: true,
            data: $scope.data
        }).success(function(data) {
            $scope.$emit('BANK_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
