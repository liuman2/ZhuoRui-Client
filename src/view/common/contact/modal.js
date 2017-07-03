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
    mobile: '',
    tel: '',
    position: '',
    email: '',
    wechat: '',
    QQ: '',
    responsable: null,
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

  $scope.title = !!index ? '修改联系人' : '添加联系人'
  if (contactId) {
    $scope.contact = {
      id: $stateParams.contactId,
      name: $stateParams.name,
      mobile: $stateParams.mobile,
      tel: $stateParams.tel,
      position: $stateParams.position,
      email: $stateParams.email,
      wechat: $stateParams.wechat,
      QQ: $stateParams.QQ,
      responsable: $stateParams.responsable,
      memo: $stateParams.memo,
    }
  }
};
