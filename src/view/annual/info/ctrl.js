var httpHelper = require('js/utils/httpHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#annual_form');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  var startYear = (new Date).getFullYear();
  $scope.years = [];

  for (var i = startYear-1; i < startYear + 3; i++) {
    $scope.years.push(i);
  }

  var order_type = $state.params.order_type,
    order_id = $state.params.order_id;

  if (order_id && order_type) {
    getBusinessOrder();
  }

  $scope.action = 'add';

  $scope.customerInfo = null;
  $scope.activeTab = 0;
  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
    if (activeIndex == 0) {
      return;
    }

    $http({
      method: 'GET',
      url: '/Timeline/GetTimelines',
      params: {
        source_id: order_id,
        source_name: order_type,
        name: '',
        show_type: activeIndex === 1 ? 9 : 1,
      }
    }).success(function(data) {
      $scope.timelines = data;
    });
  }
  switch ($state.current.name) {
    case 'annual_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'annual_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    customer_id: '',
    customer_name: '',
    customer_code: '',
    order_id: '',
    type: order_type,
    order_type_name: '',
    order_code: '',
    name_cn: '',
    name_en: '',
    salesman_id: user.id,
    salesman: user.name,
    waiter_id: '', // user.id,
    waiter_name: '', // user.name,
    assistant_id: '',
    assistant_name: '',
    currency: '',
    rate: '',
    accountant_id: '',
    date_setup_for_ann: '',
    start_annual: '',
  }

  $scope.getAnnDateName = function() {
    switch (order_type) {
      case 'reg_abroad':
      case 'reg_internal':
        return '公司成立日期';
      case 'trademark':
        return '注册时间';
      case 'patent':
        return '注册时间';
    }
  }

  if (!!id) {
    $scope.action = 'update';
    $scope.data.id = id;
    actionView();
  }

  $scope.save = function() {
    var isCurrencyValid = valid_currency();
    jForm.isValid(function(v) {
      if(!v) {
        $scope.activeTab = 0;
        $scope.$apply();
        return;
      }
      if (v) {
        if (!isCurrencyValid) {
          return;
        }

        var submitData = angular.copy($scope.data);

        submitData.date_transaction = $('#date_transaction').val();

        var url = $scope.action == 'add' ? '/Annual/Add' : '/Annual/Update';
        $http({
          method: 'POST',
          url: url,
          needLoading: true,
          data: submitData
        }).success(function(data) {
          $state.go("annual_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("annual_warning");
    } else {
      $state.go("annual_view", {
        id: id
      });
    }
  }

  $scope.showCustomerInfo = function() {
    $http({
      method: 'GET',
      url: '/Customer/GetShortInfo',
      params: {
        customer_id: $scope.data.customer_id
      }
    }).success(function(data) {
      var customer = data.customer;
      var contacts = data.contacts || [];
      $scope.customerInfo = customer;
      $scope.customerInfo.contactList = contacts;
      $scope.customerOrders = data.orders || [];
    });
  }

  $scope.getStatus = function(item) {
    switch (item.status) {
      case 0:
        return '未提交';
      case 1:
        return '已提交';
      case 2:
        return '财务已审核';
      case 3:
        return '提交人已审核';
      case 4:
        return '完成';
    }
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getTitle = function(item) {
    if (item.log_type === 1) {
      return item.title + '(年检)';
    }
    return item.title;
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

  $scope.$on('CONTACT_DONE', function(e, result) {
    console.log(result)

    if (result.contact.id == '') {
      result.contact.id = 0;
    }
    result.contact.customer_id = $scope.data.customer_id;
    $http({
      method: 'POST',
      url: '/Customer/UpdateContact',
      data: result.contact
    }).success(function(data) {
     if (result.index == null) {
        $scope.customerInfo.contactList.push(data);
      } else {
        $scope.customerInfo.contactList[result.index - 0] = data;
      }
    });
  });

  // $scope.oldClick = function() {
  //   $http({
  //     method: 'GET',
  //     url: '/Customer/UpdateOldConatacts',
  //   }).success(function(data) {
  //    alert(0)
  //   });
  // }

  function getBusinessOrder() {
    $http({
      method: 'GET',
      url: '/Annual/GetBusinessOrder',
      params: {
        orderId: order_id,
        orderType: order_type
      }
    }).success(function(data) {
      $scope.data.customer_id = data.customer_id;
      $scope.data.customer_name = data.customer_name;
      $scope.data.customer_code = data.customer_code;

      $scope.data.order_id = data.order_id;
      $scope.data.order_type_name = data.order_type_name;
      $scope.data.order_code = data.order_code;
      $scope.data.name_cn = data.name_cn;
      $scope.data.name_en = data.name_en;

      $scope.data.salesman_id = data.salesman_id;
      $scope.data.salesman = data.salesman;
      $scope.data.assistant_id = data.assistant_id;
      $scope.data.assistant_name = data.assistant_name;

      $scope.data.waiter_id = data.waiter_id;
      $scope.data.waiter_name = data.waiter_name;
      $scope.data.order_owner = data.order_owner;

      $scope.data.amount_transaction = data.annual_price;

      if (data.date_setup && data.date_setup.indexOf('T') > -1) {
        $scope.data.date_setup_for_ann = data.date_setup.split('T')[0];
      }
    });
  }

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
      url: '/Annual/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.date_transaction && data.date_transaction.indexOf('T') > -1) {
        data.date_transaction = data.date_transaction.split('T')[0];
      }

      switch (data.type) {
        case "reg_abroad":
          data.order_type_name = "境外注册";
          break;
        case "reg_internal":
          data.order_type_name = "境内注册";
          break;
        case "audit":
          data.order_type_name = "年审";
          break;
        case "trademark":
          data.order_type_name = "商标注册";
          break;
        case "patent":
          data.order_type_name = "专利注册";
          break;
        default:
          break;
      }

      $scope.data = data;

      var temp_rate = {
        rate: $scope.data.rate,
        currency: $scope.data.currency
      }

      angular.copy(temp_rate, rate_obj);
    });
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

  $scope.$on('CUSTOMER_DONE', function(e, result) {
    $scope.customerInfo = result.customer;
    $scope.$apply();
  });
};
