var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    dInput = $('.date-input'),
    jForm = $('#abroad_form');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: true,
    step: 10,
    format: 'Y-m-d H:i',
    scrollInput: false,
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  $scope.btnUploadText = '添加附件';

  $scope.action = null;
  switch ($state.current.name) {
    case 'lecture_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'lecture_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    id: '',
    title: '',
    teacher: '',
    date_at: '',
    city: '',
    address: '',
    sponsor: '',
    co_sponsor: '',
    customer_target: ''
  }

  $scope.attachments = [];

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.save = function() {

    jForm.isValid(function(v) {
      if (v) {

        var submitData = angular.copy($scope.data);
        submitData.date_at = $('#date_at').val();

        var url = $scope.action == 'add' ? '/Lecture/Add' : '/Lecture/Update';

        $http({
          method: 'POST',
          url: url,
          data: {
            lect: submitData,
            attachments: $scope.attachments
          }
        }).success(function(data) {
          $state.go("lecture_view", {
            id: data.id
          });
        });
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.action == 'add') {
      $state.go("lecture");
    } else {
      $state.go("lecture_view", {
        id: id
      });
    }
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Lecture/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.lect.date_at.indexOf('T') > -1) {
        data.lect.date_at = data.lect.date_at.split('T')[0];
      }

      $scope.data = data.lect;
      $scope.attachments = data.attachments;
    });
  }

  var h5Uploader = new H5Uploader({
    placeholder: '#btnUpload',
    uploadUrl: httpHelper.url('/Common/Upload'),
    filePostName: 'file',
    postParams: {
      DocType: 'doc'
    },
    filePostName: 'file',
    isSingleMode: true,
    fileSizeLimit: 10 * 1024,
    accept: '*/*',
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
      // $scope.attachment.attachment_url = data.url;

      $scope.attachments.push({
        name: data.name,
        attachment_url: data.url
      })

      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '添加附件';
      $scope.$apply();
    },
    typeError: function() {
      alert('格式错误');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '添加附件';
      $scope.$apply();
    },
    sizeError: function() {
      alert('文件大小不能超过10M');
      $('#btnUpload').attr('disabled', false);
      $scope.btnUploadText = '添加附件';
      $scope.$apply();
    },
    nullError: function() {
      $scope.btnUploadText = '添加附件';
      $scope.$apply();
    }
  });
};
