var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams) {
  $scope.search = {
    index: 1,
    size: 20,
    name: "",
    type: $state.current.name.indexOf('notice') > -1 ? 1 : 2
  }

  var searchStorage = sessionStorage.getItem('SEARCH_STORAGE');
  if (searchStorage) {
    var preSearch = JSON.parse(searchStorage);
    if (preSearch.key == $state.current.name) {
      $scope.search = preSearch.search;
    }
  }

  $scope.data = {
    items: [],
    page: {
      current_index: 0,
      current_size: 0,
      total_page: 0,
      total_size: 0
    }
  };

  $scope.title = $state.current.name.indexOf('notice') > -1 ? '公司公告' : '会议纪要';

  $scope.cancel = function (item) {
    $.confirm({
      title: false,
      content: '您确认要撤销吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function () {
        $http({
          method: 'GET',
          url: '/Notice/Cancel',
          params: {
            id: item.id
          }
        }).success(function (data) {
          load_data();
        });
      }
    });
  }

  $scope.release = function (item) {
    $.confirm({
      title: false,
      content: '您确认要发布该公告吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function () {
        $http({
          method: 'GET',
          url: '/Notice/Release',
          params: {
            id: item.id
          }
        }).success(function (data) {
          load_data();
        });
      }
    });
  }

  $scope.delete = function (item) {
    $.confirm({
      title: false,
      content: '您确认要删除？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function () {
        $http({
          method: 'GET',
          url: '/Notice/Delete',
          params: {
            id: item.id
          }
        }).success(function (data) {
          load_data();
        });
      }
    });
  }

  $scope.add = function () {
    switch ($state.current.name) {
      case 'notice':
        $state.go("notice_add");
        break;
      case 'conference':
        $state.go("conference_add");
        break;
      default:
        break;
    }
  }

  $scope.go = function (index) {
    $scope.search.index = index;
    load_data();
  }

  $scope.getStatus = function (status) {
    switch (status) {
      case 0:
        return '待发布';
      case 1:
        return '已发布';
      case 2:
        return '已撤销';
    }
  }

  $scope.format = function (dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  function load_data() {
    $http({
      method: 'GET',
      params: $scope.search,
      url: '/Notice/Search'
    }).success(function (data) {
      $scope.data = data;

      var searchSession = {
        key: $state.current.name,
        search: angular.copy($scope.search)
      }

      sessionStorage.setItem('SEARCH_STORAGE', JSON.stringify(searchSession));
    });
  }

  load_data();
}
