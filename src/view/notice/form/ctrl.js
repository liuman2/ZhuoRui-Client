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
    content: ''
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
    actionView();
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
};
