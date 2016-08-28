var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
    var module_name = $state.params.module_name,
        id = $state.params.id || null;

    $.datetimepicker.setLocale('ch');

    var jForm = $('#progress_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.progress = {
        id: id,
        customer_id: '',
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

    switch (module_name) {
        case 'RegAbroad':
        case 'RegInternal':
            $scope.progress.title = '注册进度';
            break;
        case 'Audit':
            $scope.progress.title = '审计进度';
            break;
        case 'Trademark':
            $scope.progress.title = '商标进度';
            break;
        case 'Patent':
            $scope.progress.title = '专利进度';
            break;
        case 'Annual':
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

    $scope.doneChange = function() {
        if ($scope.progress.is_done == 1) {
            $scope.progress.progress = '订单已完成';
        } else {
            if ($scope.progress.progress == '订单已完成') {
                $scope.progress.progress = '';

                $scope.progress.bank_id = '';
            }
        }
    }

    $scope.$watch(function() {
        return $scope.progress.is_open_bank;
    }, function(newValue, oldValue) {
        if (oldValue != undefined && newValue != undefined) {
            if (newValue == "1") {
                $timeout(function() {
                    $('#customerBankSelect2').on("change", function(e) {
                        var bank_id = $(e.target).val();

                        var banks = $('#customerBankSelect2').select2('data');
                        var select_banks = $.grep(banks, function(b) {
                            return b.id == bank_id;
                        });

                        if (select_banks.length) {
                            $scope.progress.holder = select_banks[0].holder;
                            $scope.progress.account = select_banks[0].account;
                            $scope.$apply();
                        }
                    });
                });
            }
        }
    });

    $scope.$watch(function() {
        return $scope.progress.is_done;
    }, function(newValue, oldValue) {
        if (oldValue != undefined && newValue != undefined) {
            if (newValue == "1") {
                $timeout(function() {
                    var dInput = $('.date-input');
                    dInput.datetimepicker({
                        timepicker: false,
                        maxDate: new Date(),
                        format: 'Y-m-d',
                        onChangeDateTime: function(current_time, $input) {
                            console.log(current_time)
                        }
                    });

                    $('#customerBankSelect2').on("change", function(e) {
                        var bank_id = $(e.target).val();

                        var banks = $('#customerBankSelect2').select2('data');
                        var select_banks = $.grep(banks, function(b) {
                            return b.id == bank_id;
                        });

                        if (select_banks.length) {
                            $scope.progress.holder = select_banks[0].holder;
                            $scope.progress.account = select_banks[0].account;
                            $scope.$apply();
                        }
                    });
                });
            }
        }
    });

    if (!!id) {
        getProgress();
    }

    function actionSave() {



        setSaveData();

        $http({
            method: 'POST',
            url: '/' + module_name + '/UpdateProgress',
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
            url: '/' + module_name + '/GetProgress',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.progress = angular.extend({}, $scope.progress, data);
        });
    }

    function setSaveData() {
        $scope.progress.date_finish = $('#date_finish').val();
        switch (module_name) {
            case 'RegAbroad':
                $scope.progress.date_setup = $('#date_setup').val();
                break;
            case 'RegInternal':
                $scope.progress.date_setup = $('#date_setup').val();
                break;
            case 'Audit':


                break;
            case 'Trademark':
                $scope.progress.date_receipt = $('#date_receipt').val();
                $scope.progress.date_accept = $('#date_accept').val();
                $scope.progress.date_trial = $('#date_trial').val();
                $scope.progress.date_regit = $('#date_regit').val();
                $scope.progress.date_exten = $('#date_exten').val();
                break;
            case 'Patent':
                $scope.progress.date_empower = $('#date_empower').val();
                $scope.progress.date_accept = $('#date_accept').val();
                break;
            case 'Annual':


                break;
        }
    }
};
