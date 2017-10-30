var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

  var id = $state.params.id || null;

  $scope.attachments = [];

  if (!!id) {
    $scope.id = id;
    actionView();
  }

  $scope.edit = function() {
    // $state.go('customer_edit({id: ' + id + '})');
    $state.go("bank_edit", { id: id });
  }

  $scope.cancel = function() {
    $state.go('open_bank');
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }


  function actionView() {
    $http({
      method: 'GET',
      url: '/BusinessBank/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      var bank = data.bank;
      var contacts = data.contacts || [];
      $scope.data = bank;
      $scope.data.contactList = contacts;
    });
  }
};
