var dateHelper = require('js/utils/dateHelper');

module.exports = function ($scope, $http, $state, $stateParams) {
  $scope.pages = {
    current_index: 0,
    current_size: 0,
    total_page: 0,
    total_size: 0,
    size: 20,
    index: 1
  };

  var selectStatus = 'all';

  function stopPropagationAndPreventDefault($event) {
    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();
    $event.cancelBubble = true;
    $event.returnValue = false;
  }

  function handleData(data) {
    $scope.custom = data.custom;
    angular.forEach(data.items, function (value, key) {
      value.update_time = dateHelper(value.update_time, 'Y-m-d H:i', 'Y年m月d日 H:i');
    })
    $scope.items = data.items;
    angular.extend($scope.pages, data.page);

    $scope.start = $scope.pages.current_index > 3 && $scope.pages.total_page !== 4 ? $scope.pages.total_page - 2 <= $scope.pages.current_index ? $scope.pages.total_page - 3 : $scope.pages.current_index - 1 : 2;
    $scope.end = $scope.start + 2 >= $scope.pages.total_page ? $scope.pages.total_page - 1 : $scope.start + 2;
    $scope.pageArr = function () {
      var input = [];
      for (var i = $scope.start; i <= $scope.end; i++) {
        input.push(i);
      }
      return input;
    };
  }

  function listCourse() {
    var params = {
      index: $scope.pages.index,
      size: $scope.pages.size,
      status: selectStatus
    }

    $http({
      method: 'GET',
      url: '/courses',
      params: params
    }).success(function (data, status, headers, config) {
      handleData(data);
    }).error(function (data, status) {

    })
  }

  function delCourse(id) {
    $http({
      method: 'DELETE',
      url: '/courses',
      params: {
        ids: id
      }
    }).success(function (data, status) {
      listCourse();
    }).error(function (data, status) {

    })
  }

  function copyCourse(id) {
    $http({
      method: 'POST',
      url: `/courses/${id}/copy`
    }).success(function (data, status) {
      listCourse();
    }).error(function (data, status) {
    });
  }

  function initialize() {
    listCourse();
  }

  $scope.noticeStatus = [
    'notpass',
    'auditing'
  ];

  $scope.statusDes = {
    'notpass': '审核末通过',
    'auditing': '审核中'
  }

  $scope.pagination = function ($event) {
    var $element = angular.element($event.target);
    var $elementP = $element.parent();

    var newPage;
    var totalPage = $scope.pages.total_page;
    var currentPage = $scope.pages.current_index;

    if ($elementP.hasClass('disabled')) {
      return false;
    } else if ($element.hasClass('previous')) {
      newPage = currentPage - 1;
    } else if ($element.hasClass('next')) {
      newPage = currentPage + 1;
    } else if ($element.hasClass('first')) {
      newPage = 1;
    } else if ($element.hasClass('last')) {
      newPage = totalPage;
    } else {
      newPage = +$element.text();
      if (newPage === currentPage) {
        return false;
      }
    };

    if (newPage <= 0 || newPage > totalPage) {
      return false;
    };

    $scope.pages.index = newPage;

    listCourse();
  }

  var $statusFilter = angular.element(document.getElementById('statusFilter'));
  var status = ['all', 'uncommitted', 'onshelves', 'offshelves', 'auditing', 'notpass'];
  $scope.checkStatus = function (status, $event) {
    var $element = angular.element($event.target);
    var $elementP = $element.parent();
    if (status.indexOf(status) > -1 && !$elementP.hasClass('active')) {

      $statusFilter.find('li').removeClass('active');
      $elementP.addClass('active');

      selectStatus = status;
      $scope.pages.index = 1;
      listCourse();
    }
  }

  $scope.copy = function (id) {
    $.confirm({
      title: '复制课程',
      content: "确定复制这个课程！",
      confirmButton: "确定",
      cancelButton: "取消",
      confirm: function () {
        copyCourse(id);
      }
    });
  }

  $scope.del = function (id) {
    $.confirm({
      title: '删除课程',
      content: "确定删除这个课程！",
      confirmButton: "确定",
      cancelButton: "取消",
      confirm: function () {
        delCourse(id);
      }
    });
  }

  $scope.tooltipShow = function ($event) {
    var $element = angular.element($event.target);
    var $elementTooltip = $element.parent().next();

    $elementTooltip.css('display', 'block');

    stopPropagationAndPreventDefault($event);
  }

  $scope.tooltipHide = function ($event) {
    var $element = angular.element($event.target);
    var $elementTooltip = $element.parent().next();

    $elementTooltip.css('display', 'block');

    stopPropagationAndPreventDefault($event);
  }

  $scope.page = 1;
  $scope.pageGo = function () {
    if ($scope.page != $scope.pages.current_index && $scope.page <= $scope.pages.total_page) {
      $scope.pages.index = $scope.page;
      listCourse();
    }
  }

  initialize();
}
