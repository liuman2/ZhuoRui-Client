module.exports = function($scope, $state, $http, $q, $timeout) {
    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    AREA_Module.area.provinceList.shift();
    $scope.provinceList = AREA_Module.area.provinceList;

    $scope.changeProvince = function() {
        $scope.city = '';
        $scope.county = '';
    }

    $scope.changeCity = function() {
        $scope.county = '';
    }
};
