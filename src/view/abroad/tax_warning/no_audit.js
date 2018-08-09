var httpHelper = require('js/utils/httpHelper');

module.exports = function ($scope, $state, $http, $timeout) {
    var source_id = $state.params.source_id,
        source_name = $state.params.source_name;

    var order_id = $state.params.orderId,
        recordId = $state.params.recordId,
        code = $state.params.code,
        name_cn = $state.params.name_cn,
        name_en = $state.params.name_en;

    var jForm = $('#noaudit_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.attachment = {
        order_id: order_id,
        code: code,
        name_cn: name_cn,
        name_en: name_en,
        attachment_url: '',
        recordId: recordId,
    }

    $scope.btnUploadText = '上传';

    $scope.save = function () {
        jForm.isValid(function (v) {
            if (v) {
                actionAdd();
            }
        });
    }

    function actionAdd() {
        // TODO:
        $http({
            method: 'POST',
            url: '/RegAbroad/TaxNoAudit',
            needLoading: true,
            data: {
                id: $scope.attachment.recordId,
                url: $scope.attachment.attachment_url
            }
        }).success(function (data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('ATTACHMENT_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }

    var h5Uploader = new H5Uploader({
        placeholder: '#btnUpload',
        uploadUrl: httpHelper.url('/Common/Upload'),
        filePostName: 'file',
        postParams: {
            DocType: 'doc'
        },
        filePostName: 'file',
        isSingleMode: true,
        fileSizeLimit: 20 * 1024,
        accept: '*/*',
        uploadStart: function () {
            $('#btnUpload').attr('disabled', true);
            $scope.btnUploadText = '上传中..';
            $scope.$apply();
        },
        uploadSuccess: function (idx, data) {
            console.log(data);
            if (typeof (data) == 'string') {
                data = JSON.parse(data);
            }
            $scope.attachment.attachment_url = data.url;
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        typeError: function () {
            alert('格式错误');
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        sizeError: function () {
            alert('文件大小不能超过20M');
            $('#btnUpload').attr('disabled', false);
            $scope.btnUploadText = '上传';
            $scope.$apply();
        },
        nullError: function () {
            $scope.btnUploadText = '上传';
            $scope.$apply();
        }
    });
};
