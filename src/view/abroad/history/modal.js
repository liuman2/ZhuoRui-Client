module.exports = function($scope, $state, $http, $timeout) {
    var reg_id =  $state.params.id,
        dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        scrollInput: false,
        // maxDate: new Date(),
        onChangeDateTime: function (current_time, $input) {
        }
    });

    var jForm = $('#history_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.data = {
        reg_id: reg_id
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                if ($state.current.name == 'abroad_history.edit') {
                    actionUpdate();
                } else {
                    actionAdd();
                }
            }
        });
    }

    if (reg_id) {
        actionView();
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/RegAbroad/GetHistoryTop',
            params: {
                id: reg_id
            }
        }).success(function(data) {
            if (data.date_setup && data.date_setup.indexOf('T') > -1) {
                data.date_setup = data.date_setup.split('T')[0];
            }

            $scope.data = data;
        });
    }

    function actionAdd() {
        $scope.data.date_setup = $('#date_setup').val();
        $scope.data.id = null;

        $http({
            method: 'POST',
            url: '/RegAbroad/AddHistory',
            data: $scope.data,
            needLoading: true,
        }).success(function(data) {
            $scope.$emit('HISTORY_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $scope.data.date_setup = $('#date_setup').val();

        $http({
            method: 'POST',
            url: '/RegAbroad/UpdateHistory',
            data: $scope.data,
            needLoading: true,
        }).success(function(data) {
            $scope.$emit('HISTORY_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
