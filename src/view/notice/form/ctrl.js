var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null,
    jForm = $('#notice_form');

  CKEDITOR.config.toolbar = [
    ['Styles', 'Format', 'Font', 'FontSize'],
    ['Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'Find', 'Replace', '-', 'Outdent', 'Indent', '-', 'Print'],
    ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    ['Table', '-', 'Link', 'Flash', 'Smiley', 'TextColor', 'BGColor']
  ];
  CKEDITOR.replace('editor1');
  $scope.title = $state.current.name.indexOf('notice') > -1 ? '公司公告' : '会议纪要';

  $scope.btnUploadText = '添加附件';

  $scope.action = null;
  switch ($state.current.name) {
    case 'notice_add':
    case 'conference_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'notice_edit':
    case 'conference_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  $scope.data = {
    id: '',
    title: '',
    type: $state.current.name.indexOf('notice') > -1 ? 1 : 2,
    code: '',
    content: '',
    attachments: []
  }

  $scope.goParent = function() {
    if ($state.current.name.indexOf('conference') > -1) {
      $state.go("conference");
    } else {
      $state.go("notice");
    }
  }

  if (!!id) {
    $scope.data.id = id;
    $timeout(actionView, 800);
  }

  $scope.cancel = function() {
    if ($state.current.name.indexOf('conference') > -1) {
      $state.go("conference");
    } else {
      $state.go("notice");
    }
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        var submitData = angular.copy($scope.data);
        var content = CKEDITOR.instances['editor1'].getData();
        if (!content) {
          $.alert({
            title: false,
            content: '内容不能为空',
            confirmButton: '确定'
          });
          return;
        }

        submitData.content = content;

        var url = $scope.action == 'add' ? '/Notice/Add' : '/Notice/Update';

        $http({
          method: 'POST',
          url: url,
          data: submitData
        }).success(function(data) {
          if ($state.current.name.indexOf('conference') > -1) {
            $state.go("conference");
          } else {
            $state.go("notice");
          }
        });
      }
    });
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Notice/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.data = data;
      CKEDITOR.instances['editor1'].setData(data.content);
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

      $scope.data.attachments.push({
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
