var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $cookieStore, $timeout) {

  var id = $state.params.id || null;


  if (!!id) {
    $scope.id = id;
    actionView();
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.showAudit = false;
  $scope.ownerMail = false;
  $scope.data = {}


  $scope.edit = function() {
    $state.go("letter_edit", {
      id: id
    });
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.passAudit = function() {
    /*$.confirm({
      title: false,
      content: '您确认通过审核？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Letter/PassAudit',
          params: {
            id: $scope.data.id
          }
        }).success(function(data) {
          actionView();
        });
      }
    });*/
    $state.go(".pass", null, { location: false });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'Letter' }, { location: false });
  }

  $scope.$on('REFUSE_MODAL_DONE', function(e) {
    actionView();
  });

  $scope.getStatus = function(status) {
    switch (status) {
      case 0:
        return '未审核';
      case 1:
        return '已审核';
      case -1:
        return '驳回';
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
      $scope.data = data;
      user = $cookieStore.get('USER_INFO');
      $scope.showAudit = data.audit_id == user.id;
      $scope.ownerMail = data.creator_id == user.id;
    });
  }
};
