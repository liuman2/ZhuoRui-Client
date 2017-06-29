module.exports = function($scope, $state, $http, $stateParams, $timeout) {

  var customerId = $state.params.customer_id;
  $scope.customer = angular.copy($scope.customerInfo);

  var jForm = $('#customer_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  // AREA_Module.area.provinceList.shift();
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

  setTimeout(function() {
    setArea($scope.customer);
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
