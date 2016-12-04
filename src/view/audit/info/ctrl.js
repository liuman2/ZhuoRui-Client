var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#audit_form');

  var order_type = '';
  var order_id = '';
  $scope.current_name = $state.current.name;

  if ($state.current.name == 'audit_add_s') {
    order_type = $state.params.order_type || null;
    order_id = $state.params.order_id || null;
  }


  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {
      account_period: {
        rule: "起始日:match[lt, account_period2, date];"
      },
      account_period2: {
        rule: "结束日:match:match[gt, account_period, date]"
      }
    }
  });

  $scope.action = null;

  switch ($state.current.name) {
    case 'audit_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'audit_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    type: '',
    industry: '',
    province: '',
    city: '',
    county: '',
    business_nature: '',
    contact: '',
    mobile: '',
    customer_address: '',
    tel: '',
    is_open_bank: 0,
    salesman_id: user.id,
    salesman: user.name,
    customer_id: '',
    invoice_name: '',
    invoice_tax: '',
    invoice_address: '',
    invoice_tel: '',
    invoice_bank: '',
    assistant_id: '',
    rate: '',
    invoice_account: ''
  }

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  if ($state.current.name == 'audit_add_s') {
    $scope.action = 'add';
    $scope.data.is_old = 0;
    if (order_type == 'reg_internal') {
      $scope.data.type = '境内';
    } else {
      $scope.data.type = '境外';
    }

    $http({
      method: 'GET',
      url: '/Audit/GetSourceForAudit',
      params: {
        id: order_id,
        type: order_type
      }
    }).success(function(data) {
      console.log(data)

      $scope.data.source = data.source;
      $scope.data.source_id = data.id;

      $scope.data.customer_id = data.customer_id;
      $scope.data.customer_name = data.customer_name;
      $scope.data.source_code = data.code;
      $scope.data.name_cn = data.name_cn;
      $scope.data.name_en = data.name_en;
      $scope.data.date_setup = data.date_setup;
      $scope.data.address = data.address;

      $scope.data.province = data.province;
      $scope.data.city = data.city;
      $scope.data.county = data.county;
      $scope.data.customer_address = data.customer_address;
      $scope.data.contact = data.contact;
      $scope.data.mobile = data.mobile;
      $scope.data.tel = data.tel;

      // $scope.$apply();
      $('#customerSelect2').attr('disabled', true);
    });
  }

  $scope.selectSource = function() {

    if (!$scope.data.customer_id) {
      $.alert({
        title: false,
        content: '请选择客户',
        confirmButton: '确定'
      });
      return;
    }

    if (!$scope.data.type) {
      $.alert({
        title: false,
        content: '请选择订单类别',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".source", {
      customer_id: $scope.data.customer_id,
      type: $scope.data.type
    }, { location: false });
  }

  $scope.$on('SOURCE_DONE', function(e, s) {
    console.log(s)
    $scope.data.source_id = s.id;
    $scope.data.source = $scope.data.type == '境内' ? 'reg_internal' : 'reg_abroad'
    $scope.data.source_code = s.code;
    $scope.data.name_cn = s.name_cn || '';
    $scope.data.name_en = s.name_en || '';

    $scope.data.date_setup = '';
    if (s.date_setup && s.date_setup.indexOf('T') > -1) {
      $scope.data.date_setup = s.date_setup.split('T')[0];
    }
    $scope.data.address = s.address || '';
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

  jForm.validator({
    rules: {
      'code': function(ele, params) {
        if (ele.value.length !== 8) {
          return false;
        }
        if (ele.value.indexOf('SJ') < 0) {
          return false;
        }
        return true;
      }
    }
  });

  $scope.save = function() {
    var isCustomerValid = valid_customer();
    var isAccountantVaild = true; // valid_accountant();
    var isCurrencyValid = true; //valid_currency();
    jForm.isValid(function(v) {
      if (v) {
        if (!isCustomerValid || !isAccountantVaild || !isCurrencyValid) {
          return;
        }

        var submitData = angular.copy($scope.data);

        submitData.date_setup = $('#date_setup').val();
        submitData.account_period = $('#account_period').val();
        submitData.account_period2 = $('#account_period2').val();
        if (submitData.date_month_end && submitData.date_day_end) {
          submitData.date_year_end = submitData.date_month_end + '-' + submitData.date_day_end;
        } else {
          submitData.date_year_end = '';
        }
        submitData.date_transaction = $('#date_transaction').val();

        var url = $scope.action == 'add' ? '/Audit/Add' : '/Audit/Update';
        $http({
          method: 'POST',
          url: url,
          data: submitData
        }).success(function(data) {
          $state.go("audit_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.current_name == 'audit_add') {
      if ($scope.action == 'add') {
        $state.go("audit");
      } else {
        $state.go("audit_view", {
          id: id
        });
      }
    } else {
      $state.go("annual_warning");
    }

  }
  $('#selectType').on("change", function(e) {
    $scope.data.source_id = '';
    $scope.data.source = '';
    $scope.data.source_code = '';
    $scope.$apply();
  });

  $('#customerSelect2').on("change", function(e) {
    if ($state.current.name == 'audit_add_s') {
      return;
    }
    var customer_id = $(e.target).val();

    $scope.banks = [];
    $scope.data.source_id = '';
    $scope.data.source = '';
    $scope.data.source_code = '';

    $scope.$apply();

    // setBanks(customer_id);

    var customers = $('#customerSelect2').select2('data');
    var select_customers = $.grep(customers, function(c) {
      return c.id == customer_id;
    });

    if (select_customers.length) {
      $scope.data.industry = select_customers[0].industry || null;
      $scope.data.business_nature = select_customers[0].business_nature || null;
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
    } else {
      $scope.data.industry = null;
      $scope.data.business_nature = null;
      $scope.data.province = null;
      $scope.data.city = null;
      $scope.data.county = null;
      $scope.data.customer_address = null;
      $scope.data.contact = null;
      $scope.data.mobile = null;
      $scope.data.tel = null;

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
      url: '/Audit/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.date_setup && data.date_setup.indexOf('T') > -1) {
        data.date_setup = data.date_setup.split('T')[0];
      }
      if (data.date_transaction && data.date_transaction.indexOf('T') > -1) {
        data.date_transaction = data.date_transaction.split('T')[0];
      }
      if (data.account_period && data.account_period.indexOf('T') > -1) {
        data.account_period = data.account_period.split('T')[0];
      }
      if (data.account_period2 && data.account_period2.indexOf('T') > -1) {
        data.account_period2 = data.account_period2.split('T')[0];
      }
      if (data.date_year_end && data.date_year_end.indexOf('-') > -1) {
        data.date_month_end = data.date_year_end.split('-')[0];
        data.date_day_end = data.date_year_end.split('-')[1];
      }

      $scope.data = data;

      var temp_rate = {
        rate: $scope.data.rate,
        currency: $scope.data.currency
      }

      angular.copy(temp_rate, rate_obj);
    });
  }

  function setBanks(customer_id) {
    $http({
      url: 'Customer/Banks',
      params: {
        customer_id: customer_id
      }
    }).success(function(data) {
      $scope.banks = data.items || [];
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

  // function valid_accountant() {
  //   if (!$scope.data.accountant_id) {
  //     jForm.validator('showMsg', '#accountantSelect2-validator', {
  //       type: "error",
  //       msg: "此处不能为空"
  //     });
  //     return false;
  //   } else {
  //     jForm.validator('hideMsg', '#accountantSelect2-validator');
  //     return true;
  //   }
  // }

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
