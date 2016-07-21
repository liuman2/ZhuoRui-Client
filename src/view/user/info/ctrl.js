module.exports = function ($scope, $http, $state) {

    $scope.form_status = {
        disabled: false,
        btn_text: '保存',
        msg: ''
    }

    $scope.data = $.extend(true, {}, $scope.userInfo);
    $scope.$watch('userInfo', function (newValue, oldValue) {
        $scope.data = $.extend(true, {}, $scope.userInfo);
    });

    $scope.$on('imageUploadSuccess', function(e, id, url) {
        $scope.data.header_url = url;
        $scope.data.header_id = id;
    });

    $scope.save = function() {
        $scope.form_status.msg = '';

        if (!$scope.data.header_id) {
            $scope.form_status.msg = '头像不能为空';
            return;
        }

        if (!$scope.data.name) {
            $scope.form_status.msg = '姓名不能为空';
            return;
        }

        if ( $scope.data.sex == undefined || $scope.data.sex == null) {
            $scope.form_status.msg = '性别不能为空';
            return;
        }

        if (!$scope.data.info) {
            $scope.form_status.msg = '简介不能为空';
            return;
        }

        $scope.form_status.disabled = true;
        $scope.form_status.btn_text = '提交中...';

        $http.put('/lecturers', $scope.data).then(function(data) {
            $.alert({
                title: false,
                content: '保存成功',
                confirmButton: '确定',
                confirm: function () {
                    $scope.form_status.disabled = false;
                    $scope.form_status.btn_text = '完成';
                    $scope.userInfo = $.extend(true, {}, $scope.data);
                    $state.go('user.profile', {reload: true});
                }
            });
        }, function(xhr) {
            $scope.form_status.msg = xhr.data.message || '保存失败';
            $scope.form_status.disabled = false;
            $scope.form_status.btn_text = '完成';
        });
    }

    $scope.cancel = function () {
        $state.go('user.profile');
    }
};
