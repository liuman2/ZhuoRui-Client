module.exports = function($scope, $state, $stateParams, $timeout) {
  var contactId = $state.params.contactId || null;
  var index = $stateParams.index;
  var jForm = $('#contact_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.contact = {
    id: '',
    name: '',
    tel: '',
    email: '',
    memo: null,
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('CONTACT_DONE', { contact: $scope.contact, index: $stateParams.index });
        $state.go('^');
      }
    });
  }

  $scope.title = !!index ? '修改客户经理' : '添加客户经理'
  if (contactId) {
    $scope.contact = {
      id: $stateParams.contactId,
      name: $stateParams.name,
      tel: $stateParams.tel,
      email: $stateParams.email,
      memo: $stateParams.memo,
    }
  }
};
