module.exports = function($scope, $state, $http, $cookieStore, $q, $timeout) {

  var id = $state.params.id || null,
    jForm = $('.form-horizontal');

  $scope.action = null;
  switch ($state.current.name) {
    case 'bank_add':
      $scope.action = 'add';
      $scope.current_bread = '新增';
      break;
    case 'bank_edit':
      $scope.action = 'update';
      $scope.current_bread = '修改';
      break;
    default:
      break;
  }

  jForm.validator({
    rules: {},
    fields: {}
  });

  var user = $cookieStore.get('USER_INFO');

  $scope.data = {
    contactList: []
  }

  // init();

  if (!!id) {
    $scope.data.id = id;
    actionView();
  }

  $scope.save = function() {
    var jForm = $('.form-horizontal');
    jForm.isValid(function(v) {
      if (v) {

        $scope.data.contacts = '';

        var data = angular.copy($scope.data);

        data.contactList = null;
        var contacts = angular.copy($scope.data.contactList) || [];
        if (contacts.length) {
          contacts.forEach(function(item, i) {
            if (item.id != null && typeof(item.id) == 'string' && item.id.indexOf('-') > -1) {
              item.id = 0;
            }
          });
        }

        var url = $scope.action == 'add' ? '/BusinessBank/AddOpenBank' : '/BusinessBank/UpdateBank';
        $http({
          method: 'POST',
          needLoading: true,
          url: url,
          data: {
            openBank: data,
            contacts: contacts
          }
        }).success(function(data) {
          $state.go("bank_view", { id: data.id });
        });
      }
    });
  }

  $scope.edit = function() {
    $state.go("bank_edit", { id: id });
  }

  $scope.cancel = function() {
    $state.go("open_bank");
  }

  $scope.editContact = function(index, contact) {
    $state.go('.contact_edit', {
      index: index,
      contactId: contact.id,
      name: contact.name,
      tel: contact.tel,
      email: contact.email,
      memo: contact.memo
    }, { location: false });
  }

  function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;
  }

  $scope.$on('CONTACT_DONE', function(e, result) {
    if (result.index == null) {
      result.contact.id = newGuid();
      $scope.data.contactList.push(result.contact);
    } else {
      $scope.data.contactList[result.index - 0] = result.contact;
    }
  });

  $scope.deleteContact = function(index, item) {
    $scope.data.contactList.splice(index, 1);
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/BusinessBank/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      var bank = data.bank;
      var contacts = data.contacts || [];
      $scope.data = bank;
      $scope.data.contactList = contacts;
    });
  }
};
