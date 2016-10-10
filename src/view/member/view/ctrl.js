var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    if (!!id) {
        $scope.id = id;
        actionView();
    }

    $scope.edit = function() {
        $state.go("member_edit", {id: id});
    }

    $scope.cancel = function() {
        $state.go('member');
    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.getStatus = function(status) {
        switch(status) {
            case 0:
                return '离职';
            case 1:
                return '在职';
            case 2:
                return '停薪留职';
        }
    }

    $scope.reset = function() {
        $.confirm({
            title: false,
            content: '您确认要重置密码吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Member/ResetPwd',
                    params: {
                        id: id
                    }
                }).success(function(data) {
                    if (!data.success) {
                        $.alert({
                            title: false,
                            content: '重置失败，请重试',
                            confirmButton: '确定'
                        });
                        return;
                    }
                    $.alert({
                        title: false,
                        content: '重置成功，重置后密码为 ' + data.pwd,
                        confirmButton: '确定'
                    });
                });
            }
        });
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Member/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }
};
