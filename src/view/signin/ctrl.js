module.exports = function($scope, $state, $http) {
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

                    location.href = '/index.html';
                }, function(xhr) {

                });
            }
        });
    }
};
