module.exports = function($scope, $state, $http, $timeout) {
    $scope.data = {
        phone: '',
        code: '',
        password: '',
        repwd: '',
        agree: true
    }
    $scope.form_status = {
        disabled: false,
        btn_text: '注 册',
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

    $scope.signup = function() {
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

        if (!$('#isAgree').prop('checked')) {
            $scope.form_status.error_type = 'client';
            $scope.form_status.msg = '您还未接受版权协议';
            return;
        }

        $scope.form_status.disabled = true;
        $scope.form_status.btn_text = '注册中...';

        $http.post('/register', $scope.data, {errorHandler: false}).then(function(data) {
            $scope.form_status.btn_text = '注册成功';
            $timeout(function() {
                login();
            }, 100);
        }, function(xhr) {
            $scope.form_status.error_type = 'server';
            $scope.form_status.msg = xhr.data.message || '注册失败';
            $scope.form_status.disabled = false;
            $scope.form_status.btn_text = '注 册';

        });
    }

    $scope.agree = function(e) {
        if ($scope.data.agree && $scope.form_status.error_type == 'client') {
            $scope.form_status.msg = '';
        }
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
            type: 'register'
        }).then(function(xhr) {}, function(xhr) {
            // alert(xhr.data.message);
        });
    }

    function login() {
        $http.post('/login', {
            phone: $scope.data.phone,
            password: $scope.data.password
        }, {errorHandler: false}).then(function(xhr) {
            var dt = new Date();
            var options = {
                expiresAt: dt.setTime(dt.getTime() + 24 * 60 * 60 * 1000)
            };

            cookies.set("ticket", xhr.data.ticket, options);
            $state.go('profile');
        }, function(xhr) {
            // TODO
            $state.go('signin');
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
