var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var source_id = $state.params.id;

  var jForm = $('#receipt_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.mail = {
    id: null,
    receiver: '',
    tel: '',
    province: '',
    city: '',
    county: '',
    address: ''
  }

  $scope.save = function(e) {
    if ($scope.province) {
      $scope.mail.province = $scope.province.name;
    }
    if ($scope.city) {
      $scope.mail.city = $scope.city.name;
    }
    if ($scope.county) {
      $scope.mail.county = $scope.county;
    }

    $http({
      method: 'POST',
      url: '/Letter/UpdateAddress',
      data: {
        address: $scope.mail
      }
    }).success(function(data) {
      // $(e.target).href='http://baidu.com';
      window.open('/print.html?t=address&id=' + source_id, '_blank');

      $timeout(function() {
        $state.go('^', {
          reload: true
        });
      }, 500);
    });
  }

  actionView();
$scope.mailProvinceList = AREA_Module.area.provinceList;
  function setMailArea(data) {
    var valProvince = AREA_Module.area.provinceIndex(data.province);
    if (valProvince) {
      $('select[name="province"]').val(valProvince).trigger('change');
      $scope.province = $scope.mailProvinceList[valProvince - 0];
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

  function actionView() {
    $http({
      method: 'GET',
      url: '/Letter/GetAddress',
      params: {
        id: source_id
      }
    }).success(function(data) {
      if (!!data) {
        $scope.mail = data
        setMailArea(data);
      }
    });
  }
};
