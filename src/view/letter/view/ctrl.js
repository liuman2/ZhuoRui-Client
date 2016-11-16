var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

  var id = $state.params.id || null;


  if (!!id) {
    $scope.id = id;
    actionView();
  }

  var user = $cookieStore.get('USER_INFO');

  $scope.showAudit = false;

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
    if (!confirm('您确认通过审核？')) {
      return false;
    }
    $.confirm({
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
    });
  }

  $scope.refuseAudit = function() {
    $state.go(".audit", { module_name: 'Letter' }, { location: false });
  }

  $scope.$on('REFUSE_MODAL_DONE', function(e) {
    actionView();
  });

  function actionView() {
    $http({
      method: 'GET',
      url: '/Letter/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.data = data;
      $scope.showAudit = data.audit_id == user.id;
    });
  }
};
