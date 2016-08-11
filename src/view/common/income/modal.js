var httpHelper = require('js/utils/httpHelper');

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

    $scope.btnUploadText = '上传';

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
            if (data.date_pay.indexOf('T') > -1) {
                data.date_pay = data.date_pay.split('T')[0];
            }

            $scope.income = data;
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
            $state.go('^', {
                reload: true
            });
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
                $state.go('^', {
                    reload: true
                });
            });
        }
        //
    var h5Uploader = new H5Uploader({
        placeholder: '#btnUpload',
        uploadUrl: httpHelper.url('/Common/Upload'),
        filePostName: 'file',
        postParams: {
            DocType: 'image'
        },
        filePostName: 'file',
        isSingleMode: true,
        fileSizeLimit: 5 * 1024,
        accept: 'image/*',
        uploadStart: function() {
            $('#btnUpload').attr('disabled', true);
            $scope.btnUploadText = '上传中..';
            $scope.$apply();
        },
        uploadSuccess: function(idx, data) {
            console.log(data);
            if (typeof(data) == 'string') {
                data = JSON.parse(data);
            }
            $scope.income.attachment_url = data.url;
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        typeError: function() {
            alert('格式错误');
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        sizeError: function() {
            alert('文件大小不能超过5M');
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        nullError: function() {
            $scope.btnUploadText = '上传';
            $scope.$apply();
        }
    });
};
