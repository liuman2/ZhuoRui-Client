var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#change_form');

  $scope.changes = [];

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.activeTab = 0;
  $scope.onTab = function(activeIndex) {
    $scope.activeTab = activeIndex;
  }
  $scope.action = null;
  switch ($state.current.name) {
    case 'history_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'history_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  $scope.module = {
    id: $state.params.module_id,
    source_id: $state.params.source_id,
    name: '',
    code: $state.params.code
  }

  $scope.getChangeName = function(type) {
    switch(type) {
      case 'new':
        return '新进';
      case 'exit':
        return '退出';
      case 'takes':
        return '股份调整';
      default:
        return '';
    }
  }

  $scope.editShareholder = function(index, shareholder) {
    $state.go('.shareholder_edit', {
      index: index,
      shareholderId: shareholder.id,
      name: shareholder.name,
      gender: shareholder.gender,
      cardNo: shareholder.cardNo,
      type: '股东',
      takes: shareholder.takes,
      position: shareholder.position,
      person_id: shareholder.person_id,
      changed_type: shareholder.changed_type,
      memo: shareholder.memo,
    }, { location: false });
  }

  $scope.deleteShareholder = function(index, item) {
    $scope.data.shareholderList.splice(index, 1);
  }

  $scope.editDirectory = function(index, directory) {
    $state.go('.directory_edit', {
      index: index,
      directoryId: directory.id,
      name: directory.name,
      gender: directory.gender,
      cardNo: directory.cardNo,
      person_id: directory.person_id,
      changed_type: directory.changed_type,
      memo: directory.memo,
      type: '董事',
    }, { location: false });
  }

  $scope.deleteDirectory = function(index, item) {
    $scope.data.directorList.splice(index, 1);
  }

  var user = $cookieStore.get('USER_INFO');
  $scope.data = {
    id: '',
    is_old: 0,
    customer_id: $state.params.customer_id,
    changes: [],
    amount_transaction: null,
    salesman_id: user.id,
    salesman: user.name,
    rate: '',
    currency: '',
    shareholderList: [],
    directoryList: [],
    logoff: 0,
    logoff_memo: ''
  }

  var fields = [];

  switch ($scope.module.id) {
    case 'abroad':
      $scope.data.source = 'reg_abroad';
      $scope.module.name = '境外注册';

      fields = [{
        key: 'name_cn',
        value: '公司中文名称',
        map: false
      }, {
        key: 'name_en',
        value: '公司英文名称',
        map: false
      }, {
        key: 'address',
        value: '公司注册地址',
        map: false
      }, {
        key: 'reg_no',
        value: '公司注册编号',
        map: false
      }, {
        key: 'others',
        value: '其他变更',
        map: false
      }];
      break;
    case 'internal':
      $scope.data.source = 'reg_internal';
      $scope.module.name = '境内注册';

      fields = [{
        key: 'name_cn',
        value: '公司中文名称',
        map: false
      }, {
        key: 'reg_no',
        value: '公司注册编号',
        map: false
      }, {
        key: 'address',
        value: '公司注册地址',
        map: false
      }, {
        key: 'legal',
        value: '公司法人',
        map: false
      }, {
        key: 'director',
        value: '公司监事',
        map: false
      }/*, {
        key: 'shareholder',
        value: '公司股东',
        map: false
      }*/, {
        key: 'others',
        value: '其他变更',
        map: false
      }];
      break;
    case 'trademark':
      $scope.data.source = 'trademark';
      $scope.module.name = '商标注册';

      fields = [{
        key: 'applicant',
        value: '申请人',
        map: false
      }, {
        key: 'address',
        value: '申请人地址',
        map: false
      }, {
        key: 'trademark_type',
        value: '商标类别',
        map: false
      }, {
        key: 'region',
        value: '商标注册地区',
        map: false
      }, {
        key: 'reg_mode',
        value: '注册方式',
        map: false
      }];
      break;
    case 'patent':
      $scope.data.source = 'patent';
      $scope.module.name = '专利注册';

      fields = [{
        key: 'applicant',
        value: '申请人',
        map: false
      }, {
        key: 'address',
        value: '申请人地址',
        map: false
      }, {
        key: 'card_no',
        value: '申请人证件号码',
        map: false
      }, {
        key: 'designer',
        value: '专利设计人',
        map: false
      }, {
        key: 'patent_type',
        value: '专利类型',
        map: false
      }, {
        key: 'patent_purpose',
        value: '专利用途',
        map: false
      }], {
        key: 'reg_mode',
        value: '注册方式',
        map: false
      };
      break;
  }

  angular.copy(fields, $scope.changes);

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.add = function() {
    $scope.data.changes.push({
      key: '',
      value: ''
    });
  }

  $scope.remove = function(row) {
    var index = $scope.data.changes.indexOf(row);
    $scope.data.changes.splice(index, 1);

    for (var i = 0, max = fields.length; i < max; i++) {
      var field = fields[i];
      var cs = $.grep($scope.data.changes, function(c, index) {
        return c.key == field.key;
      });
      $scope.changes[i].map = cs.length > 0;
    }
  }

  $scope.fieldChange = function(i, row) {

    for (var i = 0, max = fields.length; i < max; i++) {
      var field = fields[i];
      var cs = $.grep($scope.data.changes, function(c, index) {
        return c.key == field.key;
      });
      $scope.changes[i].map = cs.length > 0;
    }
  }

  $scope.save = function() {
    var isCurrencyValid = valid_currency();
    jForm.isValid(function(v) {
      if (v) {
        if (!isCurrencyValid) {
          return;
        }

        if ($scope.data.changes.length == 0 && $scope.data.shareholderList.length == 0 && $scope.data.directoryList.length == 0 &&  $scope.data.logoff == 0) {
          alert('您没输入任何变更数据');
          return;
        }

        var tempChanges = angular.copy($scope.data.changes);
        $scope.data.order_code = $state.params.code;
        $scope.data.source_id = $state.params.source_id;

        var changeObj = {};
        for (var i = 0, max = tempChanges.length; i < max; i++) {
          var change = tempChanges[i];
          if (!!change['key'] == true) {
            changeObj[change['key']] = change['value'];
          }
        }

        $scope.data.value = JSON.stringify(changeObj);

        if ($scope.data.changes.length > 0 && $scope.data.value == '{}' &&  $scope.data.logoff == 0) {
          alert('您没选择变更字段');
          return;
        }

        var submitData = angular.copy($scope.data);
        submitData.date_transaction = $('#date_transaction').val();


        var url = $scope.action == 'add' ? '/History/Add' : '/History/Update';
        var data = submitData;
        if ($scope.action == 'add') {
          if ($scope.data.is_old == 1) {
            submitData.date_finish = $('#date_finish').val();
          }

          data = {
            oldRequest: {
              is_old: $scope.data.is_old
            },
            _history: submitData
          };
        }

        if (submitData.shareholderList.length) {
          submitData.shareholderList.forEach(function(item, i) {
            if (item.id != null && typeof(item.id) == 'string' && item.id.indexOf('-') > -1) {
              item.id = null;
            }
          });
        }
        data.shareholderList = submitData.shareholderList || [];

        if (submitData.directoryList.length) {
          submitData.directoryList.forEach(function(item, i) {
            if (item.id != null && typeof(item.id) == 'string' && item.id.indexOf('-') > -1) {
              item.id = null;
            }
          });
        }
        submitData.directoryList = submitData.directoryList || [];

        data.shareholderList = submitData.shareholderList.concat(submitData.directoryList);


        $http({
          method: 'POST',
          url: url,
          data: data
        }).success(function(data) {
          // $state.go("history_view", { module_id: $scope.module.id, code: $scope.module.code });
          $state.go("history", { module_id: $scope.module.id, code: $scope.module.code, source_id: $scope.module.source_id });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("history", { module_id: $scope.module.id, code: $scope.module.code, source_id: $scope.module.source_id, customer_id: $state.params.customer_id });
    } else {
      $state.go("history_view", { id: id });
    }
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

  $scope.$on('DIRECTORY_DONE', function(e, result) {
    console.log(result);
    if (result.index == null) {
      result.directory.id = newGuid();
      $scope.data.directoryList.push(result.directory);
    } else {
      $scope.data.directoryList[result.index - 0] = result.directory;
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

  var rate_obj = {
    rate: '',
    currency: ''
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/History/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      console.log(data);
      var order = data.order;

      if (order.date_transaction.indexOf('T') > -1) {
        order.date_transaction = order.date_transaction.split('T')[0];
      }
      var values = JSON.parse(order.value);

      order.changes = [];
      for (var o in values) {
        order.changes.push({
          key: o,
          value: values[o]
        })
      }
      rate_obj.rate = order.rate;
      rate_obj.currency = order.currency;
      $scope.data = order;

      $scope.data.shareholderList = data.shareholderList || [];
      $scope.data.directoryList = data.directoryList || [];
      $scope.fieldChange();

      if ($scope.data.logoff) {
        $scope.activeTab = 3;
      }
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
};
