var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams, $cookieStore, $timeout) {

  $scope.search = {
    // customer_id: '',
    // waiter_id: '',
    // salesman_id: '',
    index: 1,
    size: 20,
    name: '',
    index: 1,
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

  // if ($scope.opers.indexOf(5) > -1) {
  //   $scope.search.waiter_id = $scope.userInfo.id;
  //   $scope.search.waiter_name = $scope.userInfo.name;
  // } else {
  //   $scope.search.salesman_id = $scope.userInfo.id;
  //   $scope.search.salesman = $scope.userInfo.name;
  // }

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

  function go2Timeline(item) {
    console.log(item);
    var url = '';
    switch (item.order_type) {
      case 'reg_abroad':
        $state.go('abroad_timeline', { id: item.id, name: 'reg_abroad', code: item.order_code, source: 'warning' });
        break;
      case 'reg_internal':
        $state.go('internal_timeline', { id: item.id, name: 'reg_internal', code: item.order_code, source: 'warning' });

        break;
      case 'trademark':
        $state.go('trademark_timeline', { id: item.id, name: 'trademark', code: item.order_code, source: 'warning' });
        break;
      case 'patent':
        $state.go('patent_timeline', { id: item.id, name: 'patent', code: item.order_code, source: 'warning' });
        break;
    }
  }

  function setScrollTop() {
    // sessionStorage.setItem('SCROLL_TOP', document.documentElement.scrollTop);
  }

  $scope.sendDate = function(item) {
    // $state.go("audit_add_s", { order_type: item.order_type, order_id: item.id });
    // ui-sref=".sendDate"
    $state.go('.sendDate', {
      orderId: item.id,
      code: item.code,
      name_cn: item.name_cn,
      name_en: item.name_en
    }, { location: false });
  }

  $scope.toAudit = function (item) {
    
  };

  $scope.getRedWarning = function (item) {
    if (item.month > 0) {
      return true;
    }
    // return item.month > 0;
    var dt = item.date_setup;
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];

      var t1 = moment(dt);
      var t2 = moment();

      if (t1.year() == t2.year()) {
        return false;
      }

      if (t1.month() == t2.month()) {
        if (t1.date() <= t2.date()) {
          return true;
        }
        return false;
      }

      var m2 = moment().add(2, 'month');
      var m1 = new Date(m2.year(), t1.month(), t1.date());
      if (m1.getMonth() == m2.month()) {
        return false;
      }
      if (m1 >= m2) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  $scope.getMonth = function (item) {

    // item.month <= 0 ? '-' : item.month
    var dt = item.date_setup;
    var t2 = moment();
    if (dt && dt.indexOf('T') > -1) {
      dt = dt.split('T')[0];
      var t1 = moment(dt);
      if (t1.year() == t2.year()) {
        return '-';
      }
    }

    if (item.annual_year == t2.year()) {
      return '-';
    }

    return item.month <= 0 ? '-' : item.month
  }

  $scope.format = function (dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $scope.$on('TAX_DATE_MODAL_DONE', function (e) {
    load_data();
  });

  function load_data() {
    $http({
      method: 'GET',
      url: '/RegAbroad/SearchTaxWarning',
      params: $scope.search
    }).success(function (data) {
      $scope.data = data;

      var searchSession = {
        key: $state.current.name,
        search: angular.copy($scope.search)
      }
      sessionStorage.setItem('SEARCH_STORAGE', JSON.stringify(searchSession));

      // var scrollTop = sessionStorage.getItem('SCROLL_TOP');
      // if (scrollTop) {
      //   $timeout(function() {
      //     $(document).scrollTop(scrollTop - 0);
      //   }, 3000);
      // }
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
