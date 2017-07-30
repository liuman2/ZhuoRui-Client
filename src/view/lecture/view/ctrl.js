var moment = require('moment');
moment.locale('zh-cn');
var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $q, $timeout) {

  var id = $state.params.id || null;

  $scope.search = {
    index: 1,
    size: 20,
    id: id
  }

  if (!!id) {
    $scope.id = id;
    actionView();
    getCustomers();
  }
  $scope.period = {
    disabled: false,
    days: 0
  };

  $scope.data = {}
  $scope.attachments = [];
  $scope.customers = {
    items: [],
    page: {
      current_index: 0,
      current_size: 0,
      total_page: 0,
      total_size: 0
    }
  };

  $scope.edit = function() {
    $state.go("abroad_edit", {
      id: id
    });
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.onExport = function(eve) {
    if (!$scope.customers.items.length) {
      $.alert({
        title: false,
        content: '无参会客户名单数据',
        confirmButton: '确定'
      });
      return;
    }
    var url = "/Lecture/Export?lectureId=" + id,
      iframe = document.createElement("iframe");

    iframe.src = url;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    eve.stopPropagation();
  }

  $scope.$on('CUSTOMER_MODAL_DONE', function(e) {
    getCustomers();
  });

  $scope.go = function(index) {
    $scope.search.index = index;
    getCustomers();
  };

  $scope.deleteCustomer = function(item) {
    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Lecture/DeleteLeactureCustomer',
          params: {
            leactureId: id,
            contactId: item.contact_id
          }
        }).success(function(data) {
          getCustomers();
        });
      }
    });
  }

  $scope.getEditTitle = function() {
    if (!$scope.period.disabled) {
      return '';
    }
    $('.tooltip-author').tooltipster({
      theme: 'tooltipster-sideTip-shadow',
      content: '离讲座开始时间已经超过' + $scope.period.days + '天，无法再修改',
    });
    return '离讲座开始时间已经超过' + $scope.period.days + '天，无法再修改'
  }

  $scope.getAddTitle = function() {
    if (!$scope.period.disabled) {
      return '';
    }
    $('.tooltip-author').tooltipster({
      theme: 'tooltipster-sideTip-shadow',
      content: '离讲座开始时间已经超过' + $scope.period.days + '天，无法再新增',
    });
    return '离讲座开始时间已经超过' + $scope.period.days + '天，无法再新增'
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Lecture/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      $scope.data = data.lect;
      $scope.attachments = data.attachments;
      $scope.period = data.period;
    });
  }

  function getCustomers() {
    $http({
      method: 'GET',
      url: '/Lecture/GetDetails',
      params: $scope.search
    }).success(function(data) {
      $scope.customers = data || [];
    });
  }
};
