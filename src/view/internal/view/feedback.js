module.exports = function($scope, $state, $stateParams, $http, $timeout) {
  $scope.feedback = {
    name_cn: '',
  };
  $scope.members = [];

  if ($scope.priceList.length > 0) {
    $.each($scope.priceList, function(i, item) {
      item.finisher = item.finisher || '';
    })
  }

  if (!$scope.members.length) {
    $http({
      method: 'GET',
      url: 'Member/GetAll',
      params: {
        group: '委托事项',
      }
    }).success(function(data) {
      $scope.members = data || [];
    });
  }

  $scope.finishName = function() {
    var jForm = $('#feedback_form');
    jForm.isValid(function(v) {
      if (v) {
        $http({
          method: 'POST',
          url: 'RegInternal/SureName',
          data: {
            id: $scope.data.id,
            name: $scope.feedback.name_cn
          }
        }).success(function(data) {
          $scope.data.name_cn =   $scope.feedback.name_cn;
          $state.go('^');
        });
      }
    });
  }
  $scope.finish = function(item, index) {
    var feedbackForm = $('#feedback_form' + index);
    feedbackForm.isValid(function(v) {
      if (v) {
        $http({
          method: 'POST',
          url: 'RegInternal/FinishItem',
          data: item
        }).success(function(data) {
          item.status = 1;
          $scope.$emit('ITEM_FINISH_DONE', { price: item, index: index });
          $state.go('^');
        });
      }
    });
  }
};
