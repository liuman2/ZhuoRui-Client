var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;


    if (!!id) {
        $scope.id = id;
        actionView();
    }

    $scope.data = {}


    $scope.edit = function() {
        $state.go("letter_edit", {
            id: id
        });
    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Letter/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }
};
