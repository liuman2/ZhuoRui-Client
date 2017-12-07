var httpHelper = require('js/utils/httpHelper');
module.exports = function ($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#letter_form');

  $scope.memberList = [];

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: true,
    step: 5,
    scrollInput: false,
    format: 'Y-m-d H:i',
    onChangeDateTime: function (current_time, $input) {
      console.log(current_time)
    }
  });

  var customerId = null;

  $("#orderSelect2").select2({
    language: "zh-CN",
    placeholder: "请先选择订单类别",
    ajax: {
      url: httpHelper.url("Letter/SearchOrder"),
      dataType: 'json',
      data: function (params) {
        console.log(params)
        var _params = {};
        _params['name'] = params.term || '';
        _params['type'] = $scope.data.order_source || '';
        _params['index'] = params.page || 1;
        _params['size'] = 10;
        return _params;
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        $.map(data.items, function (item) {
          item.id = item.order_id;
          item.text = item.order_name || item.order_name_en;
        });
        if (!data.page) {
          data.page = {
            total_page: 1
          }
        }
        console.log(params)
        console.log(data.page.total_page)
        return {
          results: data.items,
          pagination: {
            more: params.page < data.page.total_page
          }
        };
      }
    },
    templateResult: function (state) {
      if (!state.order_id) {
        return state.text;
      }

      var $state = $(
        '<div class="custom-select-item">\
            <div>\
              <label class="caption">档案号: </label><span>' + state['order_code'] + '</span>\
            </div>\
            <div>\
              <label class="caption">中文名: </label><span>' + (state['order_name'] || '') + '</span>\
            </div>\
            <div>\
              <label class="caption">英文名: </label><span>' + (state['order_name_en'] || '') + '</span>\
            </div>\
        </div>'
      );
      return $state;
    }
  });
  var orderList = [];
  $scope.typeChange = function (index) {
    if ($scope.action == 'update') {
      $("#orderSelect2").val(null).trigger('change');
      return;
    }
    orderList = [];
    $("#orderSelect" + index).select2({
      language: "zh-CN",
      placeholder: "请先选择订单类别",
      ajax: {
        url: httpHelper.url("Letter/SearchOrder"),
        dataType: 'json',
        data: function (params) {
          console.log(params)
          var _params = {};
          _params['name'] = params.term || '';
          _params['type'] = $scope.action == 'update' ? ($scope.data.order_source || '') : ($scope.data.orders[index].order_source || '');
          _params['index'] = params.page || 1;
          _params['size'] = 10;
          return _params;
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          $.map(data.items, function (item) {
            item.id = item.order_id;
            item.text = item.order_name || item.order_name_en;
          });
          if (!data.page) {
            data.page = {
              total_page: 1
            }
          }
          orderList = orderList.concat(data.items);
          return {
            results: data.items,
            pagination: {
              more: params.page < data.page.total_page
            }
          };
        }
      },
      templateResult: function (state) {
        if (!state.order_id) {
          return state.text;
        }

        var $state = $(
          '<div class="custom-select-item">\
              <div>\
                <label class="caption">档案号: </label><span>' + state['order_code'] + '</span>\
              </div>\
              <div>\
                <label class="caption">中文名: </label><span>' + (state['order_name'] || '') + '</span>\
              </div>\
              <div>\
                <label class="caption">英文名: </label><span>' + (state['order_name_en'] || '') + '</span>\
              </div>\
          </div>'
        );
        return $state;
      }
    });

    $("#orderSelect" + index).val(null).trigger('change');

    $("#orderSelect" + index).on("change", function (e) {
      var orders = orderList || $('#orderSelect' + index).select2('data');
      if (!orders.length) {
        if ($scope.action == 'add') {
          $scope.data.orders[index].order_id = '';
          $scope.data.orders[index].order_name = '';
          $scope.data.orders[index].order_code = '';
        }
        if ($scope.action == 'update') {
          $scope.data.order_id = '';
          $scope.data.order_name = '';
          $scope.data.order_code = '';
        }

        return;
      }
      if ($scope.action == 'add') {
        $scope.data.orders[index].order_id = $('#orderSelect' + index).val();
        var selectOrders = $.grep(orders, function (o) {
          return o.id == $scope.data.orders[index].order_id;
        });
        $scope.data.orders[index].order_name = selectOrders[0].order_name;
        $scope.data.orders[index].order_code = selectOrders[0].order_code;
        setDefaultAuditor(index, selectOrders[0]);

        if (index == 0) {
          customerId = selectOrders[0].customer_id;
          getCustomerInfo();
        }
      }
      if ($scope.action == 'update') {
        $scope.data.order_id = $('#orderSelect' + index).val();
        var selectOrders = $.grep(orders, function (o) {
          return o.id == $scope.data.order_id;
        });
        $scope.data.order_name = selectOrders[0].order_name;
        $scope.data.order_code = selectOrders[0].order_code;
        setDefaultAuditor(0, selectOrders[0]);
      }
    });

    $("#auditSelect" + index).on("change", function (e) {
      var members = $scope.memberList;
      if (!members.length) {
        if ($scope.action == 'add') {
          $scope.data.orders[index].audit_id = '';
        }
        if ($scope.action == 'update') {
          $scope.data.audit_id = '';
        }
        return;
      }
      if ($scope.action == 'add') {
        $scope.data.orders[index].audit_id = $('#auditSelect' + index).val();
      }
      if ($scope.action == 'update') {
        $scope.data.audit_id = $('#auditSelect' + index).val();
      }
    });
  }

  $scope.onAdd = function () {
    $scope.data.orders.push({
      order_source: '',
      order_id: '',
      order_name: '',
      order_code: '',
      audit_id: ''
    })
  }

  function setDefaultAuditor(index, selectedOrder) {
    var defaultAuditorId = selectedOrder.creator_id || selectedOrder.assistant_id;
    if (!defaultAuditorId) {
      return;
    }

    if ($scope.action == 'add') {
      $scope.data.orders[index].audit_id = defaultAuditorId;
      $scope.$apply();
    }
    if ($scope.action == 'update') {

    }
  }

  $('#orderSelect2').on("change", function (e) {
    $scope.getSelectShow();
    var orders = $('#orderSelect2').select2('data');
    if (!orders.length) {
      customerId = null;
      getCustomerInfo();
      return false;
    }
    if (orders[0].order_id == undefined) {
      customerId = null;
      getCustomerInfo();
      return false;
    }
    var order_id = $(e.target).val();
    // $scope.data.order_id = order_id;

    var selectOrders = $.grep(orders, function (o) {
      return o.order_id == order_id;
    });

    if (selectOrders.length) {
      $scope.data.order_code = selectOrders[0].order_code;
      $scope.data.order_name = selectOrders[0].order_name;
      customerId = selectOrders[0].customer_id;
    } else {
      $scope.data.order_code = '';
      $scope.data.order_name = '';
      customerId = null;
    }

    getCustomerInfo();
    $scope.$apply();
  });

  $scope.action = null;
  switch ($state.current.name) {
    case 'letter_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'letter_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  function getCustomerInfo() {
    if (!customerId) {
      // TODO:
      return;
    }

    $http({
      method: 'GET',
      url: '/Customer/Get',
      params: {
        id: customerId
      }
    }).success(function (data) {
      console.log(data)
      setMailArea(data.customer);
      $scope.data.address = data.customer.address || '';
    });
  }

  function setMailArea(data) {
    var valProvince = AREA_Module.area.provinceIndex(data.province);
    if (valProvince) {
      $('select[name="province"]').val(valProvince).trigger('change');
      $scope.province = $scope.mailProvinceList[valProvince - 0];
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

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    type: '寄件',
    owner: '',
    letter_type: '',
    merchant: '',
    code: '',
    date_at: '',
    description: '',
    file_url: '',
    order_id: '',
    audit_id: '',
    order_source: '',

    orders: [{
      order_source: '',
      order_id: '',
      order_name: '',
      order_code: '',
      audit_id: ''
    }]
  }

  function getMember() {
    $http({
      method: 'GET',
      url: '/Member/List',
      params: {
        index: 1,
        size: 9999,
        name: ''
      }
    }).success(function (data) {
      $scope.memberList = data.items || [];
    });
  }

  getMember();

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.getFormTitle = function () {
    if (!!id) {
      return '编辑寄件'
    }
    return '新增寄件';
  }

  function valid_order() {
    if ($scope.action == 'update') {
      if ($scope.data.order_source == 'other') {
        $scope.data.order_id = '';
        return true;
      }
      if (!$('#orderSelect2').val() || $('#orderSelect2').val().indexOf('?') >= 0) {
        jForm.validator('showMsg', '#orderSelect2-validator', {
          type: "error",
          msg: "此处不能为空"
        });
        return false;
      } else {
        jForm.validator('hideMsg', '#orderSelect2-validator');
        return true;
      }
    }

    return true;

  }

  function valid_add() {
    if ($scope.action == 'update') {
      return true;
    }
    if (!$scope.data.orders.length) {
      $.alert({
        title: false,
        content: '请选择关联订单',
        confirmButton: '确定'
      });
      return false;
    }
    var isOk = true;
    for (var i = 0; i < $scope.data.orders.length; i++) {
      var order = $scope.data.orders[i];
      if (order.order_source != 'other' && !order.order_id) {
        isOk = false;
        $.alert({
          title: false,
          content: '请选择关联订单',
          confirmButton: '确定'
        });
        break;
      }

      if (!order.audit_id) {
        isOk = false;
        $.alert({
          title: false,
          content: '请选择审核人',
          confirmButton: '确定'
        });
        break;
      }
    }

    return isOk;
  }

  function valid_audit() {
    if ($scope.action == 'add') {
      return true;
    }

    if (!$('#auditSelect2').val() || $('#auditSelect2').val().indexOf('?') >= 0) {
      jForm.validator('showMsg', '#auditSelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#auditSelect2-validator');
      return true;
    }
  }

  $scope.save = function () {
    var isOrderValid = valid_order();
    var isAuditValid = valid_audit();
    jForm.isValid(function (v) {
      if (v) {
        if (!isOrderValid) {
          return;
        }
        if (!isAuditValid) {
          return;
        }

        if (!valid_add()) {
          return;
        }

        var submitData = angular.copy($scope.data);
        submitData.date_at = $('#date_at').val();

        var order_id = $('#orderSelect2').val();
        submitData.order_id = order_id;

        if ($scope.province) {
          submitData.province = $scope.province.name;
        }
        if ($scope.city) {
          submitData.city = $scope.city.name;
        }
        if ($scope.county) {
          submitData.county = $scope.county;
        }

        var url = $scope.action == 'add' ? '/Letter/InsertLetter' : '/Letter/Update';

        $http({
          method: 'POST',
          needLoading: true,
          url: url,
          data: {
            l: submitData,
            c: submitData,
            orders: submitData.orders || []
          }
        }).success(function (data) {
          if ($scope.action == 'add') {
            $.alert({
              title: false,
              content: '保存成功',
              confirmButton: '确定'
            });

            $state.go('letter');
            return;
          }

          $state.go("letter_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function () {
    if ($scope.action == 'add') {
      $state.go("letter");
    } else {
      $state.go("letter_view", {
        id: id
      });
    }
  }

  $scope.mailProvinceList = AREA_Module.area.provinceList;
  $scope.changeMailProvince = function () {
    $scope.city = '';
    $scope.county = '';
  }

  $scope.changeMailCity = function () {
    $scope.county = '';
  }

  $scope.getSelectShow = function () {
    return !!$('#orderSelect2').val();
  }

  $scope.selectSource = function () {
    if (!$scope.data.order_id) {
      $.alert({
        title: false,
        content: '请选择订单',
        confirmButton: '确定'
      });
      return;
    }

    $state.go(".source", null, { location: false });
  }

  $scope.$on('SOURCE_DONE', function (e, s) {
    console.log(s)
    // $scope.data.source_id = s.id;
    // $scope.data.source_code = s.code;

    $scope.data.receiver = s.name;
    $scope.data.tel = s.mobile;
  });

  $('input[name="code"]').focus();

  function actionView() {
    $http({
      method: 'GET',
      url: '/Letter/Get',
      params: {
        id: id
      }
    }).success(function (data) {
      if (data.date_at.indexOf('T') > -1) {
        data.date_at = data.date_at.split('T')[0];
      }

      $scope.data = data;
      setMailArea(data);
      $timeout(function () {
        if (data.order_name) {
          var option = "<option value='" + data.order_id + "'>" + data.order_name + "</option>";
          $('#orderSelect2').append(option).val(data.order_id).trigger('change');
        }
      }, 100);
    });
  }
};
