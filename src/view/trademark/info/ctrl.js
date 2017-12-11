var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#trademark_form');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.action = null;

  switch ($state.current.name) {
    case 'trademark_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'trademark_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  $scope.activeTab = 0;
  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    industry: '',
    province: '',
    city: '',
    county: '',
    contact: '',
    mobile: '',
    customer_address: '',
    tel: '',
    salesman_id: '', //user.id,
    salesman: '', //user.name,
    creator: user.name,

    waiter_id: '',
    customer_id: '',
    currency: '',
    assistant_id: ''
  }

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  function initDate(newValue) {
    if (newValue != undefined) {
      if (newValue == "1") {
        $timeout(function() {
          var dInput = $('.date-input');
          dInput.datetimepicker({
            timepicker: false,
            scrollInput: false,
            maxDate: new Date(),
            format: 'Y-m-d',
            onChangeDateTime: function(current_time, $input) {
              console.log(current_time)
            }
          });
        });
      }
    }
  }

  $scope.$watch(function() {
    return $scope.data.is_old;
  }, function(newValue, oldValue) {
    initDate(newValue);
  });

  jForm.validator({
    rules: {
      'code': function(ele, params) {
        if (ele.value.length !== 8) {
          return false;
        }
        if (ele.value.indexOf('SB') < 0) {
          return false;
        }

         var arrs = ['XM', 'QZ', 'QD']
        var areaCode = ele.value.substr(0, 2);
        if (['XM', 'QZ', 'QD'].indexOf(areaCode) < 0) {
          return false;
        }

        var bizCode = ele.value.substr(2, 2);
        if (bizCode != 'SB') {
          return false;
        }

        return true;
      }
    },
    fields: {
      code: "required; length[8]; code;remote[get:" + httpHelper.url('/Common/ExistCode?id=trademark') + "]",
    }
  });

  $scope.save = function() {
    var isCustomerValid = valid_customer();
    var isWaiterVaild = valid_waiter();
    var isRegionValid = true; // valid_region();
    var isCurrencyValid = true; // valid_currency();
    var isRegMode = true; // valid_reg_mode();

    jForm.isValid(function(v) {
      if (v) {
        if (!isCustomerValid || !isWaiterVaild || !isRegionValid || !isCurrencyValid || !isRegMode) {
          return;
        }

        var submitData = angular.copy($scope.data);

        submitData.date_transaction = $('#date_transaction').val();
        var url = $scope.action == 'add' ? '/Trademark/Add' : '/Trademark/Update';

        var data = submitData;
        if ($scope.action == 'add') {

          if ($scope.data.is_old == 1) {
            submitData.date_receipt = $('#date_receipt').val();
            submitData.date_accept = $('#date_accept').val();
            submitData.date_trial = $('#date_trial').val();
            submitData.date_regit = $('#date_regit').val();
            submitData.date_exten = $('#date_exten').val();
          }

          data = {
            oldRequest: {
              is_old: $scope.data.is_old,
              is_already_annual: $scope.data.is_already_annual,
            },
            trade: submitData
          };
        }

        $http({
          method: 'POST',
          url: url,
          needLoading: true,
          data: submitData
        }).success(function(data) {
          $state.go("trademark_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("trademark");
    } else {
      $state.go("trademark_view", {
        id: id
      });
    }
  }

  $('#customerSelect2').on("change", function(e) {
    var customer_id = $(e.target).val();

    var customers = $('#customerSelect2').select2('data');
    var select_customers = $.grep(customers, function(c) {
      return c.id == customer_id;
    });

    if (select_customers.length) {
      $scope.data.industry = select_customers[0].industry || null;
      $scope.data.province = select_customers[0].province || null;
      $scope.data.city = select_customers[0].city || null;
      $scope.data.county = select_customers[0].county || null;
      $scope.data.customer_address = select_customers[0].address || null;
      $scope.data.contact = select_customers[0].contact || null;
      $scope.data.mobile = select_customers[0].mobile || null;
      $scope.data.tel = select_customers[0].tel || null;

      if (!id) {
        $scope.data.salesman_id = select_customers[0].salesman_id || null;
        $scope.data.salesman = select_customers[0].salesman || null;
      }

      // if (!$scope.data.invoice_name.length) {
      //     $scope.data.invoice_name = select_customers[0].name;
      // }
      // if (!$scope.data.invoice_address) {
      //     $scope.data.invoice_address = select_customers[0].address;
      // }
      // if (!$scope.data.invoice_tel) {
      //     $scope.data.invoice_tel = select_customers[0].tel || select_customers[0].mobile;
      // }

      $scope.$apply();
    }
  });

  $('#currencySelect2').on("change", function(e) {
    var currency = $(e.target).val();
    if (currency == "人民币") {
      $scope.data.rate = 1;
      $('input[name="rate"]').attr('disabled', true);
    } else {
      if (!id) {
        $scope.data.rate = '';
      } else {
        if (currency != rate_obj.currency) {
          $scope.data.rate = '';
        } else {
          $scope.data.rate = rate_obj.rate;
        }
      }
      $('input[name="rate"]').attr('disabled', false);
    }

    $scope.$apply();
  });

  var rate_obj = {
    rate: '',
    currency: ''
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Trademark/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      // if (data.date_receipt.indexOf('T') > -1) {
      //     data.date_receipt = data.date_receipt.split('T')[0];
      // }
      // if (data.date_accept.indexOf('T') > -1) {
      //     data.date_accept = data.date_accept.split('T')[0];
      // }
      // if (data.date_trial.indexOf('T') > -1) {
      //     data.date_trial = data.date_trial.split('T')[0];
      // }
      // if (data.date_regit.indexOf('T') > -1) {
      //     data.date_regit = data.date_regit.split('T')[0];
      // }
      // if (data.date_exten.indexOf('T') > -1) {
      //     data.date_exten = data.date_exten.split('T')[0];
      // }
      if (data.date_transaction && data.date_transaction.indexOf('T') > -1) {
        data.date_transaction = data.date_transaction.split('T')[0];
      }

      $scope.data = data;

      var temp_rate = {
        rate: $scope.data.rate,
        currency: $scope.data.currency
      }

      angular.copy(temp_rate, rate_obj);
    });
  }

  function valid_customer() {
    if (!$scope.data.customer_id) {
      jForm.validator('showMsg', '#customerSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#customerSelect2-validator');
      return true;
    }
  }

  function valid_waiter() {
    if (!$scope.data.waiter_id) {
      jForm.validator('showMsg', '#waiterSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#waiterSelect2-validator');
      return true;
    }
  }

  function valid_region() {
    if (!$scope.data.region) {
      jForm.validator('showMsg', '#regionSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#regionSelect2-validator');
      return true;
    }
  }

  function valid_currency() {
    if (!$scope.data.currency) {
      jForm.validator('showMsg', '#currencySelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#currencySelect2-validator');
      return true;
    }
  }

  function valid_reg_mode() {
    if (!$scope.data.reg_mode) {
      jForm.validator('showMsg', '#regModeSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#regModeSelect2-validator');
      return true;
    }
  }
};
