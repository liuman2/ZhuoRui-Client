module.exports = function($scope, $state, $http, $timeout) {
    var customer_id =  $state.params.customer_id,
        audit_id = $state.params.audit_id;

    var jForm = $('#bank_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.data = {
        id: null,
        customer_id: customer_id,
        audit_id: audit_id,
        bank: '',
        holder: '',
        account: ''
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            actionAdd();

            // if (v) {
            //     if (tid) {
            //         actionUpdate();
            //     } else {
            //         actionAdd();
            //     }
            // }
        });
    }

    /*function actionView() {
        $http({
            method: 'GET',
            url: '/Customer/Bank',
            params: {
                id: tid
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }*/

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Audit/AddBank',
            data: $scope.data
        }).success(function(data) {
            $scope.$emit('AUDIT_BANK_DONE');
            $state.go('^', { reload: true });
        });
    }

    // function actionUpdate() {
    //     $http({
    //         method: 'POST',
    //         url: '/Customer/UpdateBank',
    //         data: $scope.data
    //     }).success(function(data) {
    //         $scope.$emit('AUDIT_BANK_DONE');
    //         $state.go('^', { reload: true });
    //     });
    // }
};
