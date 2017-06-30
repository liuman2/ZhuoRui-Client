module.exports = function($scope, $state, $stateParams, $timeout) {
  var shareholderId = $state.params.shareholderId || null;
  var jForm = $('#shareholder_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.shareholder = {
    id: '',
    name: '',
    gender: '',
    cardNo: '',
    position: '',
    takes: '',
    type: '股东',
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('SHAREHOLDER_DONE', { shareholder: $scope.shareholder, index: $stateParams.index });
        $state.go('^');
      }
    });
  }

  $scope.title = !!shareholderId ? '修改股东' : '添加股东'
  if (shareholderId) {
    $scope.shareholder = {
      id: $stateParams.shareholderId,
      name: $stateParams.name,
      gender: $stateParams.gender,
      cardNo: $stateParams.cardNo,
      takes: $stateParams.takes,
      type: '股东',
    }
  }
};
