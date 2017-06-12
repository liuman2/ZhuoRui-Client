var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#abroad_form');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    scrollMonth: false,
    scrollTime: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.action = null;
  switch ($state.current.name) {
    case 'abroad_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'abroad_edit':
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
    is_open_bank: 0,
    salesman_id: user.id,
    salesman: user.name,
    waiter_id: '',
    customer_id: '',
    invoice_name: '',
    invoice_tax: '',
    invoice_address: '',
    invoice_tel: '',
    invoice_bank: '',
    rate: '',
    invoice_account: '',
    assistant_id: '',
    is_old: 0,
    is_annual: '',
    manager_id: null,
    shareholderList: []
  }

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  jForm.validator({
    rules: {
      'code': function(ele, params) {
        if (ele.value.length !== 8) {
          return false;
        }
        if (ele.value.indexOf('JW') < 0) {
          return false;
        }

        var arrs = ['XM', 'QZ', 'QD']
        var areaCode = ele.value.substr(0, 2);
        if (['XM', 'QZ', 'QD'].indexOf(areaCode) < 0) {
          return false;
        }

        var bizCode = ele.value.substr(2, 2);
        if (bizCode != 'JW') {
          return false;
        }

        return true;
      }
    },
    fields: {
      code: "required; length[8]; code;remote[get:" + httpHelper.url('/Common/ExistCode?id=reg_abroad') + "]",
    }
  });

  $scope.save = function() {
    var isCustomerValid = valid_customer();
    var isWaiterVaild = valid_waiter();
    var isSalesmanVaild = valid_salesman();
    var isRegionValid = true; // valid_region();
    var isCurrencyValid = true; // valid_currency();
    jForm.isValid(function(v) {
      if (!v) {
        if (
          !$('select[name="is_annual"]').isValid() ||
          !$('input[name="code"]').isValid() ||
          !$('input[name="name_en"]').isValid() ||
          !$('input[name="date_setup"]').isValid()) {

          $scope.activeTab = 0;
          $scope.$apply();
          return;
        }
      }

      if (v) {
        if (!isCustomerValid || !isWaiterVaild || !isRegionValid || !isCurrencyValid || !isSalesmanVaild) {

          if (!isWaiterVaild || !isSalesmanVaild) {
            $scope.activeTab = 4;
            $scope.$apply();
          }

          return;
        }

        var submitData = angular.copy($scope.data);

        // submitData.date_setup = $('#date_setup').val();
        submitData.date_transaction = $('#date_transaction').val();

        var url = $scope.action == 'add' ? '/RegAbroad/Add' : '/RegAbroad/Update';
        var data = submitData;
        if ($scope.action == 'add') {

          if ($scope.data.is_old == 1) {
            submitData.date_finish = $('#date_finish').val();
            submitData.date_setup = $('#date_setup').val();
          }
          if ($scope.data.is_annual == 1) {
            submitData.date_setup = $('#date_setup').val();
          }

          data = {
            oldRequest: {
              is_old: $scope.data.is_old,
              is_already_annual: $scope.data.is_already_annual,
            },
            aboad: submitData
          };
        }
        $http({
          method: 'POST',
          url: url,
          data: data
        }).success(function(data) {
          $state.go("abroad_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("abroad");
    } else {
      $state.go("abroad_view", {
        id: id
      });
    }
  }

  $scope.addBank = function() {
    $state.go('.bank_add', { customer_id: $scope.data.customer_id }, { location: false });
  }

  $scope.$watch(function() {
    return $scope.data.is_open_bank;
  }, function(newValue, oldValue) {
    if (oldValue != undefined && newValue != undefined) {
      if (newValue == "1") {
        $timeout(function() {
          $('#customerBankSelect2').attr('paramvalue', $scope.data.customer_id);
          setBanks();
        });
      }
    }
  });

  function initDate(newValue) {
    if (newValue != undefined) {
      if (newValue == "1") {
        $timeout(function() {
          var dInput = $('.date-input');
          dInput.datetimepicker({
            timepicker: false,
            maxDate: new Date(),
            format: 'Y-m-d',
            scrollInput: false,
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
  $scope.$watch(function() {
    return $scope.data.is_annual;
  }, function(newValue, oldValue) {
    initDate(newValue);
  });

  $('#customerSelect2').on("change", function(e) {
    var customer_id = $(e.target).val();

    $('#customerBankSelect2').attr('paramvalue', customer_id);
    setBanks();

    $('#customerBankSelect2').val(null).trigger("change");
    $scope.data.holder = '';
    $scope.data.account = '';

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

  $('#customerBankSelect2').on("change", function(e) {
    var bank_id = $(e.target).val();

    var banks = $('#customerBankSelect2').select2('data');
    var select_banks = $.grep(banks, function(b) {
      return b.id == bank_id;
    });

    if (select_banks.length) {
      $scope.data.holder = select_banks[0].holder;
      $scope.data.account = select_banks[0].account;
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

  $scope.$on('SHAREHOLDER_DONE', function(e, result) {
    console.log(result);
    if (result.index == null) {
      result.shareholder.id = newGuid();
      $scope.data.shareholderList.push(result.shareholder);
    } else {
      $scope.data.shareholderList[result.index - 0] = result.shareholder;
    }
  });

  $scope.editShareholder = function(index, shareholder) {
    $state.go('.shareholder_edit', {
      index: index,
      shareholderId: shareholder.id,
      name: shareholder.name,
      gender: shareholder.gender,
      cardNo: shareholder.cardNo,
      // position: shareholder.position,
      takes: shareholder.takes,
    }, { location: false });
  }

  var rate_obj = {
    rate: '',
    currency: ''
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/RegAbroad/Get',
      params: {
        id: id
      }
    }).success(function(data) {
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

  function setBanks() {
    $('#customerBankSelect2').select2({
      language: "zh-CN",
      placeholder: "",
      maximumSelectionSize: 8,
      ajax: {
        url: httpHelper.url('Customer/Banks'),
        type: 'GET',
        dataType: 'json',
        data: function(params) {
          return {
            customer_id: $('#customerBankSelect2').attr('paramvalue'),
            name: params.term || ''
          };
        },
        processResults: function(data, params) {
          params.page = params.page || 1;
          $.map(data.items, function(item) {
            item.text = item.name;
          });
          return {
            results: data.items,
            pagination: {
              more: false
            }
          };
        }
      }
    });
  }

  function valid_salesman() {
    if (!$scope.data.salesman_id) {
      jForm.validator('showMsg', '#salesmanSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#salesmanSelect2-validator');
      return true;
    }
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
    if ($scope.data.is_annual == 1) {
      jForm.validator('hideMsg', '#currencySelect2-validator');
      return true;
    }
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
};
