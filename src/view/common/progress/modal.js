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
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    var jForm = $('#progress_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.progress = {
        id: id,
        module: module_name,
        title: '',
        name: '',
        date_receipt: '',
        date_accept: '',
        date_trial: '',
        date_regit: '',
        date_exten: '',
        date_empower: '',
        date_regit: ''
    }

    switch(module_name) {
        case 'RegAbroad':
        case 'RegInternal':
            $scope.progress.title = '注册进度';
            break;
        case 'audit':
            $scope.progress.title = '审计进度';
            break;
        case 'Trademark':
            $scope.progress.title = '商标进度';
            break;
        case 'Patent':
            $scope.progress.title = '专利进度';
            break;
        case 'Inspection':
            $scope.progress.title = '年检进度';
            break;
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                actionSave();
            }
        });
    }

    if (!!id) {
        getProgress();
    }

    function actionSave() {
        $scope.progress.date_receipt = $('#date_receipt').val();
        $scope.progress.date_accept = $('#date_accept').val();
        $scope.progress.date_trial = $('#date_trial').val();
        $scope.progress.date_regit = $('#date_regit').val();
        $scope.progress.date_exten = $('#date_exten').val();
        $scope.progress.date_empower = $('#date_empower').val();
        $scope.progress.date_regit = $('#date_regit').val();

        $http({
            method: 'POST',
            url: '/'+ module_name +'/UpdateProgress',
            data: $scope.progress
        }).success(function(data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('PROGRESS_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }

    function getProgress() {
        $http({
            method: 'GET',
            url: '/'+ module_name +'/GetProgress',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.progress = angular.extend({}, $scope.progress, data);
        });
    }
};
