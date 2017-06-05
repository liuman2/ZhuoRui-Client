var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
    var source_id = $state.params.source_id,
        source_name = $state.params.source_name;


    var jForm = $('#attachment_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.attachment = {
        id: null,
        source_id: source_id,
        source_name: source_name,
        name: '',
        attachment_url: '',
        description: ''
    }

    $scope.btnUploadText = '上传';

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                actionAdd();
            }
        });
    }

    $scope.title = '添加附件';

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/Attachment/Add',
            data: $scope.attachment
        }).success(function(data) {
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
            $scope.attachment.attachment_url = data.url;
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
            alert('文件大小不能超过20M');
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
