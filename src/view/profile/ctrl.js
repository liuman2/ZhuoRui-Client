var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $cookieStore, $timeout) {

    $scope.userInfo = $cookieStore.get('USER_PROFILE');
    $scope.userInfo.url = $scope.userInfo.url;
    $scope.save = function() {
        var jForm = $('#form_profile');

        jForm.isValid(function(v) {
            if (v) {

                $scope.data.userId = $scope.userInfo.id;
                $http({
                    method: 'POST',
                    url: '/Account/ChangePwd',
                    data: $scope.data
                }).success(function(data) {
                    if (!data.success) {
                        alert(data.message || '密码修改失败');
                        return;
                    }

                    alert('密码修改成功');
                    location.href = '/login.html';
                });
            }
        });
    }

    var h5Uploader = new H5Uploader({
        placeholder: '#btnHeadUrl',
        uploadUrl: httpHelper.url('/Account/Upload'),
        filePostName: 'file',
        postParams: {
            DocType: 'profile',
            UserId: $scope.userInfo.id
        },
        filePostName: 'file',
        isSingleMode: true,
        fileSizeLimit: 20 * 1024,
        accept: 'image/*',
        uploadStart: function() {
        },
        uploadSuccess: function(idx, data) {
            if (typeof(data) == 'string') {
                data = JSON.parse(data);
            }

            $scope.userInfo.url = data.url;
            var u = angular.copy($scope.userInfo)
            // $scope.userInfo = {};
            // for (var o in u) {
            //     $scope.userInfo[o] = u[o];
            // }
            $cookieStore.put('USER_PROFILE', u);
            $scope.$apply();

            $scope.$emit('PROFILE_DONE');
        },
        typeError: function() {
            alert('格式错误');
        },
        sizeError: function() {
            alert('文件大小不能超过20M');
        },
        nullError: function() {
        }
    });
};
