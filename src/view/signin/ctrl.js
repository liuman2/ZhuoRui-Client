module.exports = function($scope, $state, $http) {
    $('.account-bg').height(document.documentElement.clientHeight );

    $scope.data = {
        phone: '',
        password: ''
    }
    $scope.form_status = {
        disabled: false,
        btn_text: '登 录',
        server_msg: ''
    }
    $scope.focus = function(e) {
        $(e.target).parent().removeClass('sign-err');
        $(e.target).parent().find('.sign-err-msg').remove();
        $(e.target).parent().find('input').removeClass('sign-err-border');
    }
    $scope.login = function() {
        var err = false;
        if (!$scope.data.phone) {
            showErrorTip('phone', '请输入手机号码');
            err = true;
        }
        if (!$scope.data.password) {
            showErrorTip('password', '请输入登录密码');
            err = true;
        }
        if (err) {
            return;
        }

        $scope.form_status.disabled = true;
        $scope.form_status.btn_text = '登录中...';
        $http.post('/login', $scope.data, {errorHandler: false}).then(function(xhr) {
            var dt = new Date();
            var options = {
                expiresAt: dt.setTime(dt.getTime() + 24 * 60 * 60 * 1000)
            };
            cookies.set("ticket", xhr.data.ticket, options);
            location.href = '/index.html';
        }, function(xhr) {
            $scope.form_status.server_msg = xhr.data.message || '登录失败';
            $scope.form_status.disabled = false;
            $scope.form_status.btn_text = '登 录';
        });
    }
    $scope.keypress = function (e) {
        $scope.focus(e);
        e.keyCode == 13 && $scope.login();
    }

    function showErrorTip(field, msg) {
        $('.sign-' + field).addClass('sign-err');
        $('input[name="'+ field +'"]').addClass('sign-err-border');
        var errs = $('input[name="'+ field +'"]').parent().find('label[class="sign-err-msg"]');
        if (!errs.length) {
            $('input[name="'+ field +'"]').parent().append('<label class="sign-err-msg">'+ msg +'</label>');
        }
    }
};
