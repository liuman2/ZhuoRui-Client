module.exports = function($scope, $http, $state, $stateParams) {
  $scope.search = {
    index: 1,
    size: 20,
    name: "",
    type: $state.current.name.indexOf('notice') > -1 ? 1 : 2
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

  $scope.cancel = function(item) {
    $.confirm({
      title: false,
      content: '您确认要撤销吗？',
      confirmButton: '确定',
      cancelButton: '取消',
      confirm: function() {
        $http({
          method: 'GET',
          url: '/Notice/Cancel',
          params: {
            id: item.id
          }
        }).success(function(data) {
          load_data();
        });
      }
    });
  }

  $scope.add = function() {
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

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  }

  function load_data() {
    $http({
      method: 'GET',
      params: $scope.search,
      url: '/Notice/Search'
    }).success(function(data) {
      console.log(data)
      $scope.data = data;
    });
  }

  load_data();
}
