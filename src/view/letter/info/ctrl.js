var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#letter_form');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: true,
    step: 5,
    scrollInput: false,
    format: 'Y-m-d H:i',
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $("#orderSelect2").select2({
    language: "zh-CN",
    placeholder: "请先选择订单类别",
    ajax: {
      url: httpHelper.url("Letter/SearchOrder"),
      dataType: 'json',
      data: function(params) {
        console.log(params)
        var _params = {};
        _params['name'] = params.term || '';
        _params['type'] = $scope.data.order_source || '';
        _params['index'] = params.page || 1;
        _params['size'] = 10;
        return _params;
      },
      processResults: function(data, params) {
        params.page = params.page || 1;
        $.map(data.items, function(item) {
          item.id = item.order_id;
          item.text = item.order_name;
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
    }
  });

  $scope.typeChange = function() {
    $("#orderSelect2").val(null).trigger('change');
  }

  $('#orderSelect2').on("change", function(e) {
    var orders = $('#orderSelect2').select2('data');
    if (!orders.length) {
      return false;
    }
    if (orders[0].order_id == undefined) {
      return false;
    }
    var order_id = $(e.target).val();
    // $scope.data.order_id = order_id;

    var selectOrders = $.grep(orders, function(o) {
      return o.order_id == order_id;
    });

    if (selectOrders.length) {
      $scope.data.order_code = selectOrders[0].order_code;
      $scope.data.order_name = selectOrders[0].order_name;
    } else {
      $scope.data.order_code = '';
      $scope.data.order_name = '';
    }
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
    audit_id:''
  }


  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.getFormTitle = function() {
    if (!!id) {
      return '编辑寄件'
    }
    return '新增寄件';
  }

  function valid_order() {
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

  function valid_audit() {
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

  $scope.save = function() {
    var isOrderValid = valid_order();
    var isAuditValid = valid_audit();
    jForm.isValid(function(v) {
      if (v) {
        if (!isOrderValid) {
          return;
        }
        if (!isAuditValid) {
          return;
        }

        var submitData = angular.copy($scope.data);
        submitData.date_at = $('#date_at').val();

        var order_id = $('#orderSelect2').val();
        submitData.order_id = order_id;

        var url = $scope.action == 'add' ? '/Letter/Add' : '/Letter/Update';

        $http({
          method: 'POST',
          url: url,
          data: submitData
        }).success(function(data) {
          $state.go("letter_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("letter");
    } else {
      $state.go("letter_view", {
        id: id
      });
    }
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Letter/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.date_at.indexOf('T') > -1) {
        data.date_at = data.date_at.split('T')[0];
      }

      $scope.data = data;

      $timeout(function() {
        if (data.order_name) {
          var option = "<option value='" + data.order_id + "'>" + data.order_name + "</option>";
          $('#orderSelect2').append(option).val(data.order_id).trigger('change');
        }
      }, 100);
    });
  }
};
