module.exports = function($scope, $state, $http, $timeout) {
    $scope.data = {
        phone: '',
        code: '',
        password: '',
        repwd: ''
    }

    $scope.form_status = {
        disabled: false,
        btn_text: '完 成',
        error_type: 'client',
        msg: '',

        validation_text: '获取验证码',
        validation_disabled: false
    }

    $scope.focus = function(e) {
        $(e.target).parent().removeClass('sign-err');
        $(e.target).parent().find('.sign-err-msg').remove();
        $(e.target).parent().find('input').removeClass('sign-err-border');
    }

    $scope.recovery = function() {
        var err = false;
        if (!$scope.data.phone) {
            showErrorTip('phone', '请输入手机号码');
            err = true;
        }
        var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
        if (!phoneReg.test($scope.data.phone)) {
            $scope.data.phone = '';
            showErrorTip('phone', '您输入的手机号码有误');
            err = true;
        }
        if (!$scope.data.code) {
            showErrorTip('code', '请输入验证码');
            err = true;
        }
        if (!$scope.data.password) {
            showErrorTip('password', '请输入登录密码');
            err = true;
        }

        var spaceReg = /\s/;
        if ($scope.data.password && spaceReg.test($scope.data.password)) {
            $scope.data.password = '';
            showErrorTip('password', '密码不能含有空格');
            err = true;
        }
        if (err) {
            return;
        }

        if ($scope.data.repwd != $scope.data.password) {
            $scope.data.repwd = '';
            showErrorTip('repwd', '输入的密码不一致');
            err = true;
        }

        if (err) {
            return;
        }

        $scope.form_status.disabled = true;
        $scope.form_status.btn_text = '提交中...';

        $http.put('/reset-password', $scope.data, {errorHandler: false}).then(function(data) {
            $scope.form_status.btn_text = '重置成功';
            $timeout(function() {
                $state.go('signin');
            }, 200);
        }, function(xhr) {
            $scope.form_status.error_type = 'server';
            $scope.form_status.msg = xhr.data.message || '修改失败';
            $scope.form_status.disabled = false;
            $scope.form_status.btn_text = '完 成';
        });
    }

    $scope.getCode = function() {
        if (!$scope.data.phone) {
            showErrorTip('phone', '请输入您的手机号码');
            return;
        }
        var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
        if (!phoneReg.test($scope.data.phone)) {
            $scope.data.phone = '';
            showErrorTip('phone', '您输入的手机号码有误');
            return;
        }

        var t = 60;
        $scope.form_status.validation_text = '重新发送(' + t + ')';
        $scope.form_status.validation_disabled = true;
        var timerLoop = setInterval(function() {
            if (t <= 0) {
                clearInterval(timerLoop);
                $scope.form_status.validation_text = '获取验证码';
                $scope.form_status.validation_disabled = false;
                $scope.$apply();
                return;
            }
            if (t > 0) {
                $scope.form_status.validation_text = '重新发送(' + t + ')';
                $scope.form_status.validation_disabled = true;
            }
            $scope.$apply();
            t--;
        }, 1000);

        $http.post('/verification-code', {
            phone: $scope.data.phone,
            type: 'forget'
        }).then(function(xhr) {}, function(xhr) {
            // alert(xhr.data.message);
        });
    }

    function showErrorTip(field, msg) {
        $('.sign-' + field).addClass('sign-err');
        $('input[name="' + field + '"]').addClass('sign-err-border');
        var errs = $('input[name="' + field + '"]').parent().find('label[class="sign-err-msg"]');
        if (!errs.length) {
            $('input[name="' + field + '"]').parent().append('<label class="sign-err-msg">' + msg + '</label>');
        }
    }
};
