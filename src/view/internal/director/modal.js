module.exports = function($scope, $state, $stateParams, $timeout) {
  var directorId = $state.params.directorId || null;


  console.log($scope.data.currency)

  var jForm = $('#director_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.director = {
    id: '',
    name: '',
    gender: '',
    cardNo: '',
    position: '',
    takes: '',
    type: '监事',
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('DIRECTOR_DONE', { director: $scope.director, index: $stateParams.index });
        $state.go('^');
      }
    });
  }

  $scope.title = !!directorId ? '修改监事' : '添加监事'
  if (directorId) {
    $scope.director = {
      id: $stateParams.directorId,
      name: $stateParams.name,
      gender: $stateParams.gender,
      cardNo: $stateParams.cardNo,
      type: '监事',
    }
  }
};
