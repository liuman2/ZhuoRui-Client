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
