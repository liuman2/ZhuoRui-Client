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

  $scope.sendDate = function (item) {
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
    $.confirm({
      title: false,
      content: '该税表之前已经转了审计或已经有了对应的审计记录(审计账期)，请按[标识为已转审计], 否则按[去新增审计]按钮',
      confirmButton: '去新增审计',
      cancelButton: '标识为已转审计',
      confirm: function () {
        $http({
          method: 'GET',
          url: '/RegAbroad/CheckAudit',
          params: {
            id: item.id
          }
        }).success(function (data) {
          if (data.isExist) {
            $state.go("audit_view", {
              id: data.auditId
            });
            return;
          }

          $state.go("audit_add_tax", { order_id: item.id, order_type: 'reg_abroad' });
        });
      },
      cancel: function () {

        $http({
          method: 'GET',
          url: '/RegAbroad/CheckAudit',
          params: {
            id: item.id
          }
        }).success(function (data) {
          if (!data.isExist) {
            $.alert({
              title: false,
              content: '系统没查询到该税表对应的审计订单，请按[去新增审计]新增订单',
              confirmButton: '确定'
            });
            return;
          }

          $http({
            method: 'GET',
            url: '/RegAbroad/SetAudit',
            params: {
              orderId: item.id,
              id: item.tax_record_id
            }
          }).success(function () {
            load_data();
          });
        });
      }
    });



  }

  $scope.noAudit = function (item) {
    // ui-sref=".attachment({source_name: 'reg_abroad', source_id: data.id})" ui-sref-opts="{location:false}"
    // tax_record_id

    $http({
      method: 'GET',
      url: '/RegAbroad/CheckAudit',
      params: {
        id: item.id
      }
    }).success(function (data) {
      if (data.isExist) {
        $.alert({
          title: false,
          content: '该订单已经有审计记录，不能进行零申报',
          confirmButton: '确定'
        });
        return;
      }

      // code: null,
      //   orderId: null,
      //   recordId: null,
      //   name_cn: null,
      //   name_en: null,

      // $state.go(".noaduit", { source_name: 'tax_tecord', source_id: item.tax_record_id }, { location: false });
      $state.go('.noaduit', {
        orderId: item.id,
        recordId: item.tax_record_id,
        code: item.code,
        name_cn: item.name_cn,
        name_en: item.name_en
      }, { location: false });
    });
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
