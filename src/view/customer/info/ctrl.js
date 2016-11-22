module.exports = function($scope, $state, $http, $cookieStore, $q, $timeout) {

  var id = $state.params.id || null,
    jForm = $('.form-horizontal');

  $scope.action = null;
  switch ($state.current.name) {
    case 'customer_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'customer_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  jForm.validator({
    rules: {},
    fields: {}
  });

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    province: '',
    city: '',
    county: '',
    source: '',
    source_id: '',
    salesman_id: user.id,
    salesman: user.name,
    assistant_id: '',
    assistant_name: '',
    contactList: []
  }

  init();

  if (!!id) {
    $scope.data.id = id;
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
        $scope.data.contacts = '';
        if ($scope.data.contactList.length) {
          $scope.data.contacts = JSON.stringify($scope.data.contactList);
        }
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
        var url = $scope.action == 'add' ? '/Customer/Add' : '/Customer/Update';
        $http({
          method: 'POST',
          url: url,
          data: data
        }).success(function(data) {
          $state.go("customer_view", { id: data.id });
        });
      }
    });
  }

  $scope.edit = function() {
    $state.go("customer_edit", { id: id });
  }

  $scope.cancel = function() {
    $state.go("customer");
  }

  $scope.editContact = function(index, contact) {
    $state.go('.contact_edit', {
      index: index,
      name: contact.name,
      mobile: contact.mobile,
      tel: contact.tel,
      position: contact.position,
      email: contact.email,
      wechat: contact.wechat,
      QQ: contact.QQ
    }, { location: false });
  }

  $scope.$on('CONTACT_DONE', function(e, result) {
    console.log(result);
    if (result.index == null) {
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
      url: '/Customer/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      data.contacts = data.contacts || '';
      data.contactList = [];
      if (data.contacts != '') {
        data.contactList = JSON.parse(data.contacts)
      }

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
