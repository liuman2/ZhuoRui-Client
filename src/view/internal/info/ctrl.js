var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#internal_form');

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
    case 'internal_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'internal_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
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
    salesman_id: user.id,
    salesman: user.name,
    waiter_id: '',
    outworker_id: '',
    manager_id: '',
    customer_id: 0,
    invoice_name: '',
    invoice_tax: '',
    invoice_address: '',
    invoice_tel: '',
    invoice_bank: '',
    invoice_account: '',
    rate: '',
    assistant_id: '',
    names: [{
      name: '',
      isFormal: false
    }],
    is_annual: 0
  }

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.getTitle = function(item) {
    if (item.review_status == 0) {
      $('.tooltip-author').tooltipster({
        theme: 'tooltipster-sideTip-shadow',
        content: item.finance_review_moment || item.submit_review_moment,
      });

      return item.finance_review_moment || item.submit_review_moment;
    }
    return '';
  }

  $scope.addName = function() {
    $scope.data.names.push({
      name: '',
      isFormal: false
    })
  }

  $scope.removeName = function(index) {
    $scope.data.names.splice(index, 1);
  }

  jForm.validator({
    rules: {
      'code': function(ele, params) {
        if (ele.value.length !== 8) {
          return false;
        }
        if (ele.value.indexOf('GN') < 0) {
          return false;
        }
        var arrs = ['XM', 'QZ', 'QD']
        var areaCode = ele.value.substr(0, 2);
        if (['XM', 'QZ', 'QD'].indexOf(areaCode) < 0) {
          return false;
        }

        var bizCode = ele.value.substr(2, 2);
        if (bizCode != 'GN') {
          return false;
        }

        return true;
      }
    },
    fields: {
      code: "required; length[8]; code;remote[get:" + httpHelper.url('/Common/ExistCode?id=reg_internal') + "]",
    }
  });

  $scope.save = function() {
    var isCustomerValid = valid_customer();
    var isWaiterVaild = valid_waiter();
    var isCurrencyValid = true; // valid_currency();
    jForm.isValid(function(v) {
      if (v) {
        if (!isCustomerValid || !isWaiterVaild || !isCurrencyValid) {
          return;
        }
        var submitData = angular.copy($scope.data);
        // submitData.date_setup = $('#date_setup').val();
        submitData.date_transaction = $('#date_transaction').val();
        var url = $scope.action == 'add' ? '/RegInternal/Add' : '/RegInternal/Update';
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
            reginternal: submitData
          };
        }

        $http({
          method: 'POST',
          url: url,
          data: data
        }).success(function(data) {
          $state.go("internal_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("internal");
    } else {
      $state.go("internal_view", {
        id: id
      });
    }
  }

  $scope.addBank = function() {
    $state.go('.bank_add', { customer_id: $scope.data.customer_id }, { location: false });
  }

  // $scope.$watch(function() {
  //   return $scope.data.is_old;
  // }, function(newValue, oldValue) {
  //   if (newValue != undefined) {
  //     if (newValue == "1") {
  //       $timeout(function() {
  //         var dInput = $('.date-input');
  //         dInput.datetimepicker({
  //           timepicker: false,
  //           maxDate: new Date(),
  //           format: 'Y-m-d',
  //           onChangeDateTime: function(current_time, $input) {
  //             console.log(current_time)
  //           }
  //         });
  //       });
  //     }
  //   }
  // });

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

  var rate_obj = {
    rate: '',
    currency: ''
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/RegInternal/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      // if (data.date_setup.indexOf('T') > -1) {
      //     data.date_setup = data.date_setup.split('T')[0];
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
};
