var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
    var module_name = $state.params.module_name,
        type = $state.params.type,
        id = $state.params.id || null;

    $.datetimepicker.setLocale('ch');

    var jForm = $('#progress_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });
    $scope.loadModal = false;
    $scope.module_type = type;

    $scope.progress = {
        id: id,
        customer_id: '',
        module: module_name,
        title: '',
        name: '',
        date_receipt: '',
        date_accept: '',
        date_trial: '',
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

    $timeout(function() {
        var dInput = $('.date-input');
        dInput.datetimepicker({
            timepicker: false,
            // maxDate: new Date(),
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

    /*$scope.$watch(function() {
        // return $scope.progress.is_done;
        return $scope.module_type;
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
    });*/

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
            $scope.loadModal = true;
            if (data.date_finish != undefined) {
                if (data.date_finish.indexOf('T') > -1) {
                    data.date_finish = data.date_finish.split('T')[0];
                }
            }
            if (data.date_setup != undefined) {
                if (data.date_setup.indexOf('T') > -1) {
                    data.date_setup = data.date_setup.split('T')[0];
                }
            }
            if (data.date_receipt != undefined) {
                if (data.date_receipt.indexOf('T') > -1) {
                    data.date_receipt = data.date_receipt.split('T')[0];
                }
            }
            if (data.date_accept != undefined) {
                if (data.date_accept.indexOf('T') > -1) {
                    data.date_accept = data.date_accept.split('T')[0];
                }
            }
            if (data.date_trial != undefined) {
                if (data.date_trial.indexOf('T') > -1) {
                    data.date_trial = data.date_trial.split('T')[0];
                }
            }
            if (data.date_regit != undefined) {
                if (data.date_regit.indexOf('T') > -1) {
                    data.date_regit = data.date_regit.split('T')[0];
                }
            }
            if (data.date_exten != undefined) {
                if (data.date_exten.indexOf('T') > -1) {
                    data.date_exten = data.date_exten.split('T')[0];
                }
            }
            if (data.date_empower != undefined) {
                if (data.date_empower.indexOf('T') > -1) {
                    data.date_empower = data.date_empower.split('T')[0];
                }
            }
            data.is_open_bank = data.is_open_bank + '';
            $scope.progress = angular.extend({}, $scope.progress, data);
        });
    }

    function setSaveData() {
        $scope.progress.date_finish = $('#date_finish').val();
        $scope.progress.progress_type = $scope.module_type;

        if ($scope.module_type == 'p') {
            return;
        }
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
                // $scope.progress.date_exten = $('#date_exten').val();
                break;
            case 'Patent':
                $scope.progress.date_empower = $('#date_empower').val();
                $scope.progress.date_accept = $('#date_accept').val();
                $scope.progress.date_regit = $('#date_regit').val();
                break;
            case 'Annual':
                break;
        }
    }
};
