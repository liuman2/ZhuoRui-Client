module.exports = function($scope, $state, $stateParams, $http, $timeout) {
    var id = $state.params.id || null;
    $scope.data = {
        id: id,
        name: '',
        sex: '',
        info: '',
        header_id: '',
        header_url: ''
    }

    $scope.form_status = {
        disabled: false,
        btn_text: '完成',
        msg: ''
    }

    $scope.$on('imageUploadSuccess', function(e, id, url) {
        $scope.data.header_url = url;
        $scope.data.header_id = id;
    });

    $scope.done = function() {
        $scope.form_status.msg = '';

        if (!$scope.data.header_id) {
            $scope.form_status.msg = '头像不能为空';
            return;
        }

        if (!$scope.data.name) {
            $scope.form_status.msg = '姓名不能为空';
            return;
        }

        if (!$scope.data.sex) {
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
            $scope.form_status.btn_text = '保存成功';
            $timeout(function() {
                // TODO
                location.href='/index.html';
            }, 200);
        }, function(xhr) {
            $scope.form_status.msg = xhr.data.message || '保存失败';
            $scope.form_status.disabled = false;
            $scope.form_status.btn_text = '完成';
        });
    }
};
