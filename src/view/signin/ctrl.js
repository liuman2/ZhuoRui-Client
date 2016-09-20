module.exports = function($scope, $state, $http, $cookieStore) {
    var jForm = $('#login-form');

    jForm.validator({
        // theme: 'yellow_right',
        rules: {},
        fields: {}
    });

    $scope.data = {
        username: '',
        password: ''
    }
    $scope.error_msg = '';

    $scope.keypress = function (e) {
        // $scope.focus(e);
        e.keyCode == 13 && $scope.login();
    }

    $scope.login = function() {
        jForm.isValid(function(v) {
            if (v) {
                $http.post('/Account/SignIn', $scope.data, {
                    errorHandler: false
                }).then(function(xhr) {
                    if (!xhr.data.success) {
                        $scope.error_msg = "用户名或密码错误";
                        return;
                    }

                    $cookieStore.put('USER_INFO', xhr.data.user);
                    location.href = '/index.html';
                }, function(xhr) {

                });
            }
        });
    }
};
