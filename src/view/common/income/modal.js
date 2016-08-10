module.exports = function($scope, $state, $http, $timeout) {
    var source_id = $state.params.id,
        customer_id = $state.params.customer_id,
        source_name = $state.params.source_name,
        dInput = $('.date-input'),
        tid = $state.params.tid || null;

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        maxDate: new Date(),
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    var jForm = $('#income_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.income = {
        id: null,
        source_id: source_id,
        source_name: source_name,
        customer_id: customer_id,
        payer: '',
        account: '',
        amount: '',
        date_pay: '',
        attachment_url: '',
        description: ''
    }

    $scope.save = function() {
        $scope.income.date_pay = $('#date_pay').val();
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

    $scope.title = !!tid ? '修改收款' : '添加收款'
    if (tid) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Income/Get',
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
            url: '/Income/Add',
            data: $scope.income
        }).success(function(data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('INCOME_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $http({
            method: 'POST',
            url: '/Income/Update',
            data: $scope.income
        }).success(function(data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('INCOME_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
