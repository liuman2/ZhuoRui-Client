var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $timeout) {
  var source_id = $state.params.id,
    code = $state.params.code,
    from = $state.params.source,
    source_name = $state.params.name;

  $scope.timeline = {
    title: '',
    sref: '',
    code: code,
  };

  $scope.search = {
    name: '',
    show_type: 9,
  }

  $scope.onTab = function(type) {
    $scope.search.show_type = type;
    getTimeline();
  }

  $scope.activeTab = 9;

  switch (source_name) {
    case 'reg_abroad':
      $scope.timeline.title = '境外注册';
      if (from == 'list') {
        $scope.timeline.sref = 'abroad';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'abroad_view({id: ' + source_id + '})';
      }
      break;
    case 'reg_internal':
      $scope.timeline.title = '境内注册';
      if (from == 'list') {
        $scope.timeline.sref = 'internal';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'internal_view({id: ' + source_id + '})';
      }
      break;
    case 'annual':
      $scope.timeline.title = '年检业务';
      if (from == 'list') {
        $scope.timeline.sref = 'annual';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'annual_view({id: ' + source_id + '})';
      }
      break;
    case 'audit':
      $scope.timeline.title = '审计业务';
      if (from == 'list') {
        $scope.timeline.sref = 'audit';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'audit_view({id: ' + source_id + '})';
      }
      break;
    case 'patent':
      $scope.timeline.title = '专利业务';
      if (from == 'list') {
        $scope.timeline.sref = 'patent';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'patent_view({id: ' + source_id + '})';
      }
      break;
    case 'trademark':
      $scope.timeline.title = '商标业务';
      if (from == 'list') {
        $scope.timeline.sref = 'trademark';
      } else if (from == 'warning') {
        $scope.timeline.title = '年检预警';
        $scope.timeline.sref = 'annual_warning';
      } else {
        $scope.timeline.sref = 'trademark_view({id: ' + source_id + '})';
      }
      break;
    case 'history':
      $scope.timeline.title = '变更业务';
      $scope.timeline.sref = 'history_view({id: ' + source_id + '})';
      break;
    case 'sub_audit':
      $scope.timeline.title = '审计业务-账期';
      var masterId = $state.params.masterid;
      $scope.timeline.sref = 'audit_view({id: ' + masterId + '})';
      break;
  }

  $scope.data = {
    items: []
  };

  $scope.getTitle = function(item) {
    if (item.log_type === 1) {
      return item.title + '(年检)';
    }
    return item.title;
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  function getTimeline() {
    $http({
      method: 'GET',
      url: '/Timeline/GetTimelines',
      params: {
        source_id: source_id,
        source_name: source_name,
        name: $scope.search.name,
        show_type: $scope.search.show_type,
      }
    }).success(function(data) {
      $scope.data = data;
    });
  }

  $scope.delete = function(item) {
    $.confirm({
      title: false,
      content: '您确认要删除吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Timeline/Delete',
          params: {
            id: item.id
          }
        }).success(function(data) {
          getTimeline();
        });
      }
    });
  }

  $scope.query = function() {
    getTimeline();
  }

  $scope.$on('R_TIMELINE_MODAL_DONE', function(e) {
    getTimeline();
  });

  getTimeline();
};
