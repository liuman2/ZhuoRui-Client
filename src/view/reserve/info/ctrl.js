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
    source_id: '',
    assistant_id: '',
    contactList: []
  }

  init();

  if (!!id) {
    $scope.id = id;
    actionView();
  }

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
  }

  $scope.mailProvinceList = AREA_Module.area.provinceList;
  $scope.changeMailProvince = function() {
    $scope.mailling_city = '';
    $scope.mailling_county = '';
  }

  $scope.changeMailCity = function() {
    $scope.mailling_county = '';
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
        if ($scope.data.source == '客户介绍' && !$scope.data.source_id ) {
          $.alert({
            title: false,
            content: '请选择介绍人',
            confirmButton: '确定'
          });
          return;
        }

        $scope.data.contacts = '';
        // if ($scope.data.contactList.length) {
        //   $scope.data.contacts = JSON.stringify($scope.data.contactList);
        // }
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

        if ($scope.mailling_province) {
          data.mailling_province = $scope.mailling_province.name;
        }
        if ($scope.mailling_city) {
          data.mailling_city = $scope.mailling_city.name;
        }
        if ($scope.mailling_county) {
          data.mailling_county = $scope.mailling_county;
        }

        data.contactList = null;
        var contacts = angular.copy($scope.data.contactList) || [];
        if (contacts.length) {
          contacts.forEach(function(item, i) {
            if (item.id != null && typeof(item.id) == 'string' && item.id.indexOf('-') > -1) {
              item.id = 0;
            }
          });
        }

        var url = $scope.action == 'add' ? '/Reserve/Add' : '/Reserve/Update';
        $http({
          method: 'POST',
          needLoading: true,
          url: url,
          data: {
            c: data,
            contacts: contacts
          }
        }).success(function(data) {
          $state.go('reserve');
        });
      }
    });
  }

  $scope.edit = function() {
    $state.go('reserve.detail.edit({id: ' + id + '})')
  }

  $scope.editContact = function(index, contact) {
    $state.go('.contact_edit', {
      index: index,
      contactId: contact.id,
      name: contact.name,
      mobile: contact.mobile,
      tel: contact.tel,
      position: contact.position,
      email: contact.email,
      wechat: contact.wechat,
      QQ: contact.QQ,
      responsable: contact.responsable,
      memo: contact.memo
    }, { location: false });
  }

  function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;
  }

  $scope.$on('CONTACT_DONE', function(e, result) {
    if (result.index == null) {
      result.contact.id = newGuid();
      $scope.data.contactList.push(result.contact);
    } else {
      $scope.data.contactList[result.index - 0] = result.contact;
    }
  });

  $scope.deleteContact = function(index, item) {
    $scope.data.contactList.splice(index, 1);
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Reserve/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      var customer = data.customer;
      var contacts = data.contacts || [];

      $scope.data = customer;
      $scope.data.contactList = contacts;

      setTimeout(function() {
        setArea(customer);
        setMailArea(customer);
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
  }
};
