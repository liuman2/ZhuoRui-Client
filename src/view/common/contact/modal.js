module.exports = function($scope, $state, $stateParams, $timeout) {
  var index = $state.params.index || null;


  console.log($scope.data.currency)

  var jForm = $('#contact_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.contact = {
    name: '',
    mobile: '',
    tel: '',
    position: '',
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        // angular.copy($scope.contact);
        $scope.$emit('CONTACT_DONE', {contact: $scope.contact, index: index});
        $state.go('^');
      }
    });
  }

  $scope.title = !!index ? '修改联系人' : '添加联系人'
  if (index) {
    $scope.contact = {
      name: $stateParams.name,
      mobile: $stateParams.mobile,
      tel: $stateParams.tel,
      position: $stateParams.position
    }
  }
};
