var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var id = $state.params.id;

  console.log($state.current.name)
  console.log($state.params.id)

  $scope.members = [];
  if (!$scope.members.length) {
    $http({
      method: 'GET',
      url: 'Member/GetAll',
    }).success(function(data) {
      $scope.members = data || [];
    });
  }

  var jForm = $('#creator_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.creator = {
    id: id,
    creator_id: '',
    creator: ''
  }

  $scope.save = function() {
    var name = $state.current.name;
    var url = '';

    switch(name) {
      case 'abroad_view.creator':
        url = 'RegAbroad/UpdateCreator';
        break;
      case 'internal_view.creator':
        url = 'RegInternal/UpdateCreator';
        break;
      case 'internal_view.creator':
        url = 'RegInternal/UpdateCreator';
        break;
      case 'trademark_view.creator':
        url = 'Trademark/UpdateCreator';
        break;
      case 'patent_view.creator':
        url = 'Patent/UpdateCreator';
        break;
    }
    jForm.isValid(function(v) {
      if (v) {
        $scope.creator.creator = $("#editCreator").find("option:selected").text();

        $http({
          method: 'POST',
          url: url,
          needLoading: true,
          data: $scope.creator
        }).success(function(data) {
          if (!data.success) {
            alert(data.message || '保存失败')
            return;
          }

          $scope.$emit('CREATOR_MODAL_DONE');
          $state.go('^', {
            reload: true
          });
        });
      }
    });
  }
};
