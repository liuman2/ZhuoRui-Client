module.exports = function($scope, $http, $state) {
  var customer_id = $state.params.customer_id;

  $scope.selectedSource = {};

  $scope.search = {
    index: 1,
    size: 20,
    name: ""
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

  $scope.query = function() {
    load_data();
  };

  $scope.isSelected = (id) => {
    return $scope.selectedSource.hasOwnProperty(id);
  }
  $scope.updateSelection = ($event, item) => {
    $scope.selectedSource = item;
  }

  $scope.save = function() {

    if (!$scope.selectedSource.id) {
      $state.go('^', {}, { reload: false });
      return;
    }


    console.log($scope.selectedSource.id)

    $scope.$emit('SOURCE_DONE', $scope.selectedSource);

    $state.go('^', {}, { reload: false });
  }

  function load_data() {
    $http({
      method: 'GET',
      params: {
        customer_id: customer_id,
        type: '境内'
      },
      url: '/Annual/GetSourceForAudit'
    }).success(function(data) {
      console.log(data)
      $scope.sources = data;
    });
  }

  $scope.go = function(index) {
    $scope.search.index = index;
    load_data();
  }

  load_data();
}
