var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#account_form');

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
    case 'account_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'account_edit':
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
    is_old: 0,
    source_type: '',
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
        if (bizCode != 'JZ') {
          return false;
        }

        return true;
      }
    },
    fields: {
      code: "required; length[8]; code;remote[get:" + httpHelper.url('/Common/ExistCode?id=account') + "]",
    }
  });

  $scope.selectSource = function() {
    if (!$scope.data.customer_id) {
      $.alert({
        title: false,
        content: '请选择客户',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".source", {
      customer_id: $scope.data.customer_id
    }, { location: false });
  }

  $scope.$on('SOURCE_DONE', function(e, s) {
    console.log(s)
    $scope.data.source_id = s.id;
    $scope.data.source_code = s.code;
  });

  $scope.save = function() {
    var isCustomerValid = valid_customer();
    var isSalesmanVaild = valid_salesman();
    jForm.isValid(function(v) {
      if (v) {
        if (!isCustomerValid || !isSalesmanVaild) {
          return;
        }

        if ($scope.data.source_type == 0 && !$scope.data.source_code) {
          $.alert({
            title: false,
            content: '请选择订单来源',
            confirmButton: '确定'
          });
          return;
        }

        var submitData = angular.copy($scope.data);

        // submitData.date_setup = $('#date_setup').val();
        submitData.date_transaction = $('#date_transaction').val();

        var url = $scope.action == 'add' ? '/Accounting/Add' : '/Accounting/Update';
        var data = submitData;
        if ($scope.action == 'add') {
          data = {
            oldRequest: {
              is_old: $scope.data.is_old,
            },
            acc: submitData
          };
        }
        $http({
          method: 'POST',
          url: url,
          data: data,
          needLoading: true,
        }).success(function(data) {
          if ($scope.action == 'add') {
            $.alert({
              title: false,
              content: '保存成功，请新增账期',
              confirmButton: '确定'
            });
          }

          $state.go("account_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("account");
    } else {
      $state.go("account_view", {
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

  function actionView() {
    $http({
      method: 'GET',
      url: '/Accounting/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.order.date_transaction && data.order.date_transaction.indexOf('T') > -1) {
        data.order.date_transaction = data.order.date_transaction.split('T')[0];
      }

      $scope.data = data.order;
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
    return true;
    // if (!$scope.data.salesman_id) {
    //   jForm.validator('showMsg', '#salesmanSelect2-validator', {
    //     type: "error",
    //     msg: "此处不能为空"
    //   });
    //   return false;
    // } else {
    //   jForm.validator('hideMsg', '#salesmanSelect2-validator');
    //   return true;
    // }
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
};
