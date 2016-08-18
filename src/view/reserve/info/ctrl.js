module.exports = function($scope, $state, $http, $cookieStore, $q, $timeout) {

    var id = $state.params.id || null,
        jForm = $('.form-horizontal');

    jForm.validator({
        rules: {},
        fields: {}
    });

    var user = $cookieStore.get('USER_INFO');

    $scope.data = {
        province: '',
        city: '',
        county: '',
        salesman_id: user.id,
        salesman: user.name,
        source: '',
        source_id: ''
    }

    init();

    if (!!id) {
        $scope.id = id;
        actionView();
    }

    AREA_Module.area.provinceList.shift();
    $scope.provinceList = AREA_Module.area.provinceList;

    $scope.changeProvince = function() {
        $scope.city = '';
        $scope.county = '';
    }

    $scope.changeCity = function() {
        $scope.county = '';
    }

    $scope.sourceChange = function() {
        console.log($scope.data.source)
    }

    $('select[name="source"]').on('change', function(e) {
        if ($(e.target).val() == '客户介绍') {
            $('#source_customer').show();
        } else {
            $('#source_customer').hide();
        }
    })

    $scope.save = function() {
        var jForm = $('.form-horizontal');
        jForm.isValid(function(v) {
            if (v) {

                var data = angular.copy($scope.data);
                data.province = '';
                data.city = '';

                if ($scope.province) {
                    data.province = $scope.province.name;
                }
                if ($scope.city) {
                    data.city = $scope.city.name;
                }
                if ($scope.county) {
                    data.county = $scope.county;
                }
                var url = $scope.action == 'add' ? '/Reserve/Add' : '/Reserve/Update';
                $http({
                    method: 'POST',
                    url: url,
                    data: data
                }).success(function(data) {
                    $state.go('reserve');
                });
            }
        });
    }

    $scope.edit = function() {
        $state.go('reserve.detail.edit({id: ' + id + '})')
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Reserve/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
            setTimeout(function() {
                setArea(data);
            }, 10);

            init();
        });
    }

    function init() {
        if ($scope.data.source == '客户介绍') {
            $('#source_customer').show();
        } else {
            $('#source_customer').hide();
        }
    }

    function setArea(data) {
        var valProvince = AREA_Module.area.provinceIndex(data.province);
        if (valProvince) {
            $('select[name="province"]').val(valProvince).trigger('change');
            $scope.province = $scope.provinceList[valProvince - 0];
        } else {
            return;
        }

        var valCity = AREA_Module.area.cityIndex(data.city);
        if (valCity) {
            $('select[name="city"]').val(valCity).trigger('change');
            $scope.city = $scope.province.cityList[valCity - 0];
        } else {
            return;
        }

        var valCounty = AREA_Module.area.areaIndex(data.county);
        if (valCounty) {
            $('select[name="county"]').val(valCounty).trigger('change');
            $scope.county = $scope.city.areaList[valCounty - 0];
        }
    }
};
