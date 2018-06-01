var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var source_id = $state.params.id,
    customer_id = $state.params.customer_id,
    source_name = $state.params.source_name,
    dInput = $('.date-input'),
    tid = $state.params.tid || null;

  if (source_name == 'sub_audit') {
    source_id = $state.params.subId;
  }
  if (source_name == 'accounting_item') {
    source_id = $state.params.subId;
  }

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    maxDate: new Date(),
    format: 'Y-m-d',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });


  var jForm = $('#income_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.notify_day = 15;

  $scope.income = {
    id: null,
    source_id: source_id,
    source_name: source_name,
    customer_id: customer_id,
    currency: $scope.data.currency,
    rate: $scope.data.rate,
    payer: '',
    account: '',
    amount: '',
    date_pay: '',
    pay_way: '',
    attachment_url: '',
    description: ''
  }

  $scope.btnUploadText = '上传';

  $scope.save = function() {
    $scope.income.date_pay = $('#date_pay').val();
    var isPaywayValid = valid_payway();
    jForm.isValid(function(v) {
      if (v) {
        if (!isPaywayValid) {
          return;
        }

        if (tid) {
          actionUpdate();
        } else {
          actionAdd();
        }
      }
    });
  }

  $scope.currencyChange = function(e) {
    if ($scope.income.currency == '人民币') {
      $scope.income.rate = 1;
    } else if ($scope.income.rate == 1) {
      $scope.income.rate = '';
    }
    $scope.$apply();
  }

  $scope.bankChange = function(e) {
    var index = $('#selectBanks').prop('selectedIndex');
    var bank = $scope.banks[index - 1];
    $scope.income.account = bank.account;
  }

  $scope.title = !!tid ? '修改收款' : '添加收款'
  if (tid) {
    actionView();
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Income/Get',
      params: {
        id: tid
      }
    }).success(function(data) {
      if (data.date_pay.indexOf('T') > -1) {
        data.date_pay = data.date_pay.split('T')[0];
      }

      $scope.income = data;
      if (source_name == 'accounting_item') {
        $scope.income.source_name = source_name;
      }
    });
  }

  function actionAdd() {
    $http({
      method: 'POST',
      url: '/Income/Add',
      needLoading: true,
      data: $scope.income
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      if ($scope.income.source_name == 'accounting_item') {
        var date = $('select[name="notify_year"]').val() + '-' + $('select[name="notify_month"]').val() + '-15';
        $scope.$emit('INCOME_MODAL_DONE', date);
        $state.go('^', {
          reload: true
        });
        return;
      }

      $scope.$emit('INCOME_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
  }

  function actionUpdate() {
    $http({
      method: 'POST',
      url: '/Income/Update',
      needLoading: true,
      data: $scope.income
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      if ($scope.income.source_name == 'accounting_item') {
        var date = $('select[name="notify_year"]').val() + '-' + $('select[name="notify_month"]').val() + '-15';
        $scope.$emit('INCOME_MODAL_DONE', date);
        $state.go('^', {
          reload: true
        });
        return;
      }

      $scope.$emit('INCOME_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
  }

  function valid_payway() {
    if (!$scope.income.pay_way) {
      jForm.validator('showMsg', '#payWaySelect2-validator', {
        type: "error",
        msg: "此处不能为空"
      });
      return false;
    } else {
      jForm.validator('hideMsg', '#payWaySelect2-validator');
      return true;
    }
  }

  var h5Uploader = new H5Uploader({
    placeholder: '#btnUpload',
    uploadUrl: httpHelper.url('/Common/Upload'),
    filePostName: 'file',
    postParams: {
      DocType: 'image'
    },
    filePostName: 'file',
    isSingleMode: true,
    fileSizeLimit: 5 * 1024,
    accept: 'image/*',
    uploadStart: function() {
      $('#btnUpload').attr('disabled', true);
      $scope.btnUploadText = '上传中..';
      $scope.$apply();
    },
    uploadSuccess: function(idx, data) {
      console.log(data);
      if (typeof(data) == 'string') {
        data = JSON.parse(data);
      }
      $scope.income.attachment_url = data.url;
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    typeError: function() {
      alert('格式错误，图片只支持jpg格式');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    sizeError: function() {
      alert('图片大小不能超过5M');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    nullError: function() {
      $scope.btnUploadText = '上传';
      $scope.$apply();
    }
  });

  $scope.banks = [];

  function getBanks() {
    $http({
      method: 'GET',
      url: '/Bank/Search',
      params: {
        index: 1,
        size: 100,
        name: ''
      }
    }).success(function(data) {
      console.log(data)
      $scope.banks = data.items || [];
    });
  }

  getBanks();
};
