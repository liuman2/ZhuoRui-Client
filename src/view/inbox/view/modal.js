var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var module_name = $state.params.module_name,
    id = $state.params.id || null;

  console.log(id);
  var jForm = $('#pass_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.audit = {
    id: id,
    order_source: '',
    order_id: '',
    order_code: '',
    order_name: '',
    letter_type: ''
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
        _params['type'] = $scope.audit.order_source || '';
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

    var selectOrders = $.grep(orders, function(o) {
      return o.order_id == order_id;
    });

    if (selectOrders.length) {
      $scope.audit.order_code = selectOrders[0].order_code;
      $scope.audit.order_name = selectOrders[0].order_name;
    } else {
      $scope.audit.order_code = '';
      $scope.audit.order_name = '';
    }
    $scope.$apply();
  });

  function valid_order() {
    if ($scope.audit.order_source == 'other') {
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

    var submitData = angular.copy($scope.audit);
    var order_id = $('#orderSelect2').val();
    submitData.order_id = order_id;

    $http({
      method: 'POST',
      url: '/Letter/PassInbox',
      data: submitData
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
