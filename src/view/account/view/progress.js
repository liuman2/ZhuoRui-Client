var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var source_id = $state.params.item_id,
    dInput = $('.date-input'),
    tid = $state.params.tid || null;

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

  var jForm = $('#progress_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.progress = {
    id: null,
    master_id: source_id,
    date_start: '',
    progress: '',
    attachment: '',
  }

  $scope.btnUploadText = '上传';

  $scope.save = function() {
    $scope.progress.date_start = $('#date_start').val();
    jForm.isValid(function(v) {
      if (v) {
        if (tid) {
          actionUpdate();
        } else {
          actionAdd();
        }
      }
    });
  }

  $scope.title = !!tid ? '修改进度' : '添加进度'
  if (tid) {
    actionView();
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Accounting/GetProgress',
      params: {
        id: tid
      }
    }).success(function(data) {
      if (data.date_start.indexOf('T') > -1) {
        data.date_start = data.date_start.split('T')[0];
      }

      if (data.period) {
        var ps = data.period.split('-');
        data.period_year = ps[0];
        data.period_month = ps[1];
      }

      $scope.progress = data;
    });
  }

  function actionAdd() {
    $scope.progress.period = $scope.progress.period_year + '-' + $scope.progress.period_month;
    $http({
      method: 'POST',
      url: '/Accounting/AddProress',
      data: { progress: $scope.progress }
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      $scope.$emit('PROGRESS_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
  }

  function actionUpdate() {
    $scope.progress.period = $scope.progress.period_year + '-' + $scope.progress.period_month;
    $http({
      method: 'POST',
      url: '/Accounting/UpdateProress',
      data: { progress: $scope.progress }
    }).success(function(data) {
      if (!data.success) {
        alert(data.message || '保存失败')
        return;
      }

      $scope.$emit('PROGRESS_MODAL_DONE');
      $state.go('^', {
        reload: true
      });
    });
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
    fileSizeLimit: 20 * 1024,
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
      $scope.progress.attachment = data.url;
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    typeError: function() {
      alert('格式错误');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    sizeError: function() {
      alert('文件大小不能超过20M');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '上传';
      $scope.$apply();
    },
    nullError: function() {
      $scope.btnUploadText = '上传';
      $scope.$apply();
    }
  });
};
