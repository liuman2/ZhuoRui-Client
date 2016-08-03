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

    $scope.save = function() {
        var jForm = $('.form-horizontal');
        jForm.isValid(function(v) {
            if (v) {
                $http({
                    method: 'POST',
                    url: '/Reserve/Add',
                    data: $scope.data
                }).success(function(data) {
                    $state.go('reserve');
                });
            }
        });
    }
};
