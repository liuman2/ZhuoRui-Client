var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
    var dInput = $('.date-input'),
        module_name = $state.params.module_name,
        id = $state.params.id || null;



    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        maxDate: new Date(),
        format: 'Y-m-d',
        scrollInput: false,
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    var jForm = $('#done_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.done = {
        id: id,
        date_finish: ''
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                actionSave();
            }
        });
    }

    function actionSave() {
        $scope.done.date_finish = $('#date_finish').val();
        $http({
            method: 'POST',
            url: '/'+ module_name +'/Finish',
            data: $scope.done
        }).success(function(data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('FINISH_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }
};
