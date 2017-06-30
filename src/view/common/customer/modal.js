module.exports = function($scope, $state, $http, $stateParams, $timeout) {

  var customerId = $state.params.customer_id;
  $scope.customer = angular.copy($scope.customerInfo);

  var jForm = $('#customer_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.provinceList = AREA_Module.area.provinceList;
  $scope.changeProvince = function() {
    $scope.city = '';
    $scope.county = '';
  }

  $scope.changeCity = function() {
    $scope.county = '';
  }

  $scope.mailProvinceList = AREA_Module.area.provinceList;
  $scope.changeMailProvince = function() {
    $scope.mailling_city = '';
    $scope.mailling_county = '';
  }

  $scope.changeMailCity = function() {
    $scope.mailling_county = '';
  }

  setTimeout(function() {
    setArea($scope.customer);
    setMailArea($scope.customer);
  }, 10);
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

    $scope.$apply();
  }
  function setMailArea(data) {
    var valProvince = AREA_Module.area.provinceIndex(data.mailling_province);
    if (valProvince) {
      $('select[name="mailling_province"]').val(valProvince).trigger('change');
      $scope.mailling_province = $scope.mailProvinceList[valProvince - 0];
    } else {
      return;
    }

    var valCity = AREA_Module.area.cityIndex(data.mailling_city);
    if (valCity) {
      $('select[name="mailling_city"]').val(valCity).trigger('change');
      $scope.mailling_city = $scope.mailling_province.cityList[valCity - 0];
    } else {
      return;
    }

    var valCounty = AREA_Module.area.areaIndex(data.mailling_county);
    if (valCounty) {
      $('select[name="mailling_county"]').val(valCounty).trigger('change');
      $scope.mailling_county = $scope.mailling_city.areaList[valCounty - 0];
    }

    $scope.$apply();
  }


  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {

        var postData = angular.copy($scope.customer);
        postData.province = '';
        postData.city = '';
        if ($scope.province) {
          postData.province = $scope.province.name;
        }
        if ($scope.city) {
          postData.city = $scope.city.name;
        }
        if ($scope.county) {
          postData.county = $scope.county;
        }

        if ($scope.mailling_province) {
          postData.mailling_province = $scope.mailling_province.name;
        }
        if ($scope.mailling_city) {
          postData.mailling_city = $scope.mailling_city.name;
        }
        if ($scope.mailling_county) {
          postData.mailling_county = $scope.mailling_county;
        }

        $http({
          method: 'POST',
          url: '/Customer/UpdateShortInfo',
          data: postData
        }).success(function(data) {
          if (!data.success) {
            alert(data.message || '保存失败')
            return;
          }

          $scope.$emit('CUSTOMER_DONE', { customer: postData });
          $state.go('^');
        });
      }
    });
  }

};
