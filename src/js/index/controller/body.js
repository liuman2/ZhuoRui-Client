module.exports = function($scope, $rootScope, $http, $cookieStore) {
    $scope.bodyClass = '';

    $scope.userInfo = {};
    $scope.menus = [];

    var user = $cookieStore.get('USER_INFO');
    if (!user) {
        location.href = '/login.html';
    }

    $http({
        method: 'GET',
        url: '/Account/GetProfile'
    }).success(function(data) {
        $scope.menus = data.menus;
        $scope.userInfo = data.user;
        $scope.opers = data.opers;
        if (!data.user) {
            location.href = '/login.html';
        }

        data.user.url = data.user.url;
        $cookieStore.put('USER_OPERS', data.opers);
        $cookieStore.put('USER_PROFILE', data.user);

    }).error(function() {
    });



    $scope.exit = function() {
        $http({
            method: 'GET',
            url: '/Account/SignOut'
        }).success(function() {
            location.href = '/login.html';
        }).error(function() {
            location.href = '/login.html';
        });
    }

    $scope.$on('PROFILE_DONE', function(e) {
        $scope.userInfo = $cookieStore.get('USER_PROFILE');
        $scope.$apply();
    });

    $scope.$on('HAS_READ', function(e) {
        GetMessageInfo();
        $scope.$apply();
    });

    function GetMessageInfo() {
        $http({
            method: 'GET',
            url: '/Home/WaitdealCount'
        }).success(function(data) {
            $scope.Waitdeal = data;
        }).error(function() {
        });
    }

    GetMessageInfo();
};
