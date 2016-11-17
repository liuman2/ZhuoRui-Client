var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var module_name = $state.params.module_name,
    id = $state.params.id || null;


  var jForm = $('#audit_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.audit = {
    id: id,
    description: ''
  }

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

  function valid_order() {
    if (!$('#orderSelect2').val()) {
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

  $scope.save = function() {
    var isOrderValid = valid_order();

    jForm.isValid(function(v) {
      if (!isOrderValid) {
        return;
      }
      if (v) {
        actionAdd();
      }
    });
  }

  function actionAdd() {
    $http({
      method: 'POST',
      url: '/' + module_name + '/RefuseAudit',
      data: $scope.audit
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      $scope.$emit('REFUSE_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
  }
};
