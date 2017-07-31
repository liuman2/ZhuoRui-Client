var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams, $cookieStore) {

  $scope.search = {
    title: '',
    order_type: '',
    area: ''
  }

  if ($scope.opers == undefined) {
    $scope.opers = $cookieStore.get('USER_OPERS');
  }

  var user = $cookieStore.get('USER_INFO');
  if (!user) {
    location.href = '/login.html';
  }

  if ($scope.userInfo.id == undefined) {
    $scope.userInfo = user;
  }

  $scope.data = {
    items: []
  };

  $scope.query = function() {
    load_data();
  };

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getOrderStatus = function(status) {
    status = status - 0;
    switch(status) {
      case 1:
        return '转出';
      case 2:
        return '注销';
    }
  }

  $scope.revert = function(item) {
    var status = ['转出', '注销'];
    var msg = `${item.order_type_name}订单【${item.order_name || item.order_code}】，已${status[item.order_status - 1]}，确定要恢复年检吗？`;
    $.confirm({
      title: false,
      content: msg,
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Annual/Revert',
          params: {
            id: item.id,
            type: item.order_type,
          }
        }).success(function(data) {
          load_data();
        });
      }
    });
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/Annual/OffOrders',
      params: $scope.search
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
