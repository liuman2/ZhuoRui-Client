var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#inbox_form');

  $scope.memberList = [];

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: true,
    step: 5,
    format: 'Y-m-d H:i',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  function setDefaultAuditor(index, selectedOrder) {
    var defaultAuditorId = selectedOrder.assistant_id || selectedOrder.salesman_id;
    if (!defaultAuditorId) {
      return;
    }

    if ($scope.action == 'add') {
      $scope.data.orders[index].audit_id = defaultAuditorId;
      $scope.$apply();
    }
    if ($scope.action == 'update') {

    }
    // $('#auditSelect' + index).val(defaultAuditorId).trigger('change');
  }

  $("#orderSelect0").select2({
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

  $scope.typeChange = function(index) {
    $("#orderSelect" + index).select2({
      language: "zh-CN",
      placeholder: "请先选择订单类别",
      ajax: {
        url: httpHelper.url("Letter/SearchOrder"),
        dataType: 'json',
        data: function(params) {
          console.log(params)
          var _params = {};
          _params['name'] = params.term || '';
          _params['type'] = $scope.action == 'update' ? ($scope.data.order_source || '') : ($scope.data.orders[index].order_source || '');
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

    $("#orderSelect" + index).val(null).trigger('change');

    $("#orderSelect" + index).on("change", function(e) {
      var orders = $('#orderSelect' + index).select2('data');
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
        var selectOrders = $.grep(orders, function(o) {
          return o.id == $scope.data.orders[index].order_id;
        });
        $scope.data.orders[index].order_name = selectOrders[0].order_name;
        $scope.data.orders[index].order_code = selectOrders[0].order_code;
        setDefaultAuditor(index, selectOrders[0]);
      }
      if ($scope.action == 'update') {
        $scope.data.order_id = $('#orderSelect' + index).val();
        var selectOrders = $.grep(orders, function(o) {
          return o.id == $scope.data.order_id;
        });
        $scope.data.order_name = selectOrders[0].order_name;
        $scope.data.order_code = selectOrders[0].order_code;
        setDefaultAuditor(0, selectOrders[0]);
      }
    });

    $("#auditSelect" + index).on("change", function(e) {
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

  $scope.onAdd = function() {
    $scope.data.orders.push({
      order_source: '',
      order_id: '',
      order_name: '',
      order_code: '',
      audit_id: ''
    })
  }

  $scope.onDel = function(index, order) {
    $scope.data.orders.splice(index, 1);
  }

  $scope.action = null;
  switch ($state.current.name) {
    case 'inbox_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'inbox_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    type: '收件',
    owner: '',
    letter_type: '',
    merchant: '',
    code: '',
    date_at: '',
    description: '',
    file_url: '',
    order_id: '',
    order_source: '',
    orders: [{
        order_source: '',
        order_id: '',
        order_name: '',
        order_code: '',
        audit_id: ''
      }]
      // audit_id: []
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
    }).success(function(data) {
      $scope.memberList = data.items || [];
    });
  }

  getMember();

  if (!!id) {
    $scope.data.id = id;
    actionView();
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
    if ($scope.action != 'add') {
      if (!$scope.data.order_source) {
        $.alert({
          title: false,
          content: '请选择关联订单类别',
          confirmButton: '确定'
        });
        return false;
      }
      if ($scope.data.order_source != 'other' && (!$('#orderSelect0').val() || $('#orderSelect0').val().indexOf('?') >= 0)) {
        $.alert({
          title: false,
          content: '请选择关联订单',
          confirmButton: '确定'
        });
        return false;

      }

      if (!$('#auditSelect0').val() || $('#auditSelect0').val().indexOf('?') >= 0) {
        $.alert({
          title: false,
          content: '请选择审核人',
          confirmButton: '确定'
        });
        return false;
      }
      return true;
    } else {
      console.log($scope.data.orders);

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

  }

  $scope.save = function() {
    var isOrderValid = true; // valid_order();
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

        // var order_id = $('#orderSelect2').val();
        // submitData.order_id = order_id;

        var url = $scope.action == 'add' ? '/Letter/InsertInbox' : '/Letter/Update';
        if ($scope.action != 'add') {
          submitData.audit_id = $('#auditSelect0').val();
        }

        var msg = '您确定要保存?'
        if ($scope.action == 'add') {
          msg = '您选择了' + submitData.orders.length + '笔关联订单，将新增' + submitData.orders.length + '笔收件记录。保存后将无法修改，保存前请确认您输入的资料是否正确。';
        }

        $.confirm({
          title: '提示',
          content: msg,
          confirmButton: '确认无误, 保存',
          cancelButton: '再检查一遍',
          confirm: function() {
            $http({
              method: 'POST',
              needLoading: true,
              url: url,
              data: {
                l: submitData,
                c: submitData,
                inboxOrders: submitData.orders || []
              }
            }).success(function(data) {
              $.alert({
                title: false,
                content: '保存成功',
                confirmButton: '确定'
              });

              $state.go('inbox');
            });
          }
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go('inbox');
    } else {
      $state.go('inbox_view', {
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
      data.order_source = data.order_source || '';
      data.order_name = data.order_name || '';
      data.order_code = data.order_code || '';
      data.order_id = data.order_id || '';
      $scope.data = data;

      $timeout(function() {
        if (data.order_name) {
          var option = "<option value='" + data.order_id + "'>" + data.order_name + "</option>";
          $('#orderSelect0').append(option).val(data.order_id).trigger('change');
        }
      }, 100);
    });
  }


};
