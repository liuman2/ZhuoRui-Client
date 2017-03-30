module.exports = function($scope, $state, $stateParams, $timeout) {
  var index = $state.params.index || null;


  console.log($scope.data.currency)

  var jForm = $('#internalitem_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.shareholder = {
    name: '',
    gender: '',
    cardNo: '',
    position: '',
    takes: '',
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('ITEM_DONE', { shareholder: $scope.shareholder, index: index });
        $state.go('^');
      }
    });
  }

  $scope.title = !!index ? '修改委托事项' : '添加委托事项'
  if (index) {
    $scope.shareholder = {
      name: $stateParams.name,
      gender: $stateParams.gender,
      cardNo: $stateParams.cardNo,
      position: $stateParams.position,
      takes: $stateParams.takes,
    }
  }
};
