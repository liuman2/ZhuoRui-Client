module.exports = function ($scope, $http, $state) {
    var jForm = $('#password');
    $scope.password = {
        old_password: '',
        new_password: ''
    }
    jForm.validator({
        timely: 2,
        valid: function () {
            $http.put('/change-password', $scope.password).then(function () {
                $.alert({
                    title: false,
                    content: '保存成功',
                    confirmButton: '确定',
                    confirm: function () {
                        $state.go('user.profile', {reload: true});
                    }
                });
            })
        }
    })
    $scope.cancel = () => {
        $state.go('user.profile');
    }
};