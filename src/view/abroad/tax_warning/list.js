var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams, $cookieStore, $timeout) {
  var order_id = $state.params.orderId;

  $scope.search = {
    index: 1,
    size: 20,
    name: '',
    index: 1,
    order_id: order_id
  }

  var searchStorage = sessionStorage.getItem('SEARCH_STORAGE');
  if (searchStorage) {
    var preSearch = JSON.parse(searchStorage);
    if (preSearch.key == $state.current.name) {
      $scope.search = preSearch.search;
    }
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
    items: [],
    page: {
      current_index: 0,
      current_size: 0,
      total_page: 0,
      total_size: 0
    }
  };

  $scope.go = function (index) {
    $scope.search.index = index;
    load_data();
  };

  $scope.query = function () {
    load_data();
  };

  $scope.format = function (dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.getDealWay = function (way) {
    switch (way) {
      case 0:
        return '未处理';
      case 1:
        return '零申报';
      case 2:
        return '转审计';
    }
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/RegAbroad/TaxList',
      params: $scope.search
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

  function resizable(th, options) {
    var pressed = false
    var start = undefined
    var startX, startWidth

    options = options || {}
    var min = options.min || 30

    $(th).css({
      cursor: 'e-resize'
    })

    $(th).each(function (index, ele) {
      const _width = $(ele).width()
      $(ele).width(_width)
    })

    $(th).mousedown(function (e) {
      start = $(this);
      pressed = true;
      startX = e.pageX;
      startWidth = $(this).width();
    })

    $(document).mousemove(function (e) {
      if (pressed) {
        var width = startWidth + (e.pageX - startX)
        width = width < min ? min : width
        $(start).width(width);
      }
    })

    $(document).mouseup(function () {
      if (pressed) pressed = false;
    })

  }

  resizable('table th');
}
