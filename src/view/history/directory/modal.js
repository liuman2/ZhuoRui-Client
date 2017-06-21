module.exports = function($scope, $http, $state, $stateParams, $timeout) {
  var directoryId = $state.params.directoryId || null;


  console.log($scope.data.currency)

  var jForm = $('#directory_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.directory = {
    id: '',
    changed_type: '',
    name: '',
    gender: '',
    cardNo: '',
    type: '董事',
    person_id: '',
    memo: null,
  }


  $scope.holderList = [];

  $scope.typeChange = function() {
    if ($scope.directory.changed_type != 'new') {
      return;
    }

    $scope.directory.person_id = '';
    $scope.directory.name = '';
    $scope.directory.gender = '';
    $scope.directory.cardNo = '';
  }

  $scope.checkDisabled = function(optionId) {
    var directoryList = $scope.data.directoryList || [];
    if (!directoryList.length) {
      return false;
    }

    if ($scope.directory.person_id == optionId) {
      return false;
    }

    var selectedDirectorys = $.grep(directoryList, function(s, i) {
      return s.person_id == optionId;
    });

    return selectedDirectorys.length > 0;
  }

  $scope.checkedSelected = function(personId, optionId) {
    return personId == optionId;
  }

  $scope.personChange = function() {
    var holders = $.grep($scope.holderList, function(h, i) {
      return h.id == $scope.directory.person_id;
    });

    if (holders.length) {
      $scope.directory.name = holders[0].name;
      $scope.directory.gender = holders[0].gender;
      $scope.directory.cardNo = holders[0].cardNo;
    } else {
      $scope.directory.name = '';
      $scope.directory.gender = '';
      $scope.directory.cardNo = '';
    }
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('DIRECTORY_DONE', { directory: $scope.directory, index: $stateParams.index });
        $state.go('^');
      }
    });
  }

  $scope.checkSelected = function(optionId) {
    var directoryList = $scope.data.directoryList || [];
    if (!directoryList.length) {
      return false;
    }

    var selectedHolders = $.grep(directoryList, function(s, i) {
      return s.person_id == optionId;
    });

    return selectedHolders.length > 0;
  }

  if (directoryId) {
    $scope.directory = {
      id: $stateParams.directoryId,
      name: $stateParams.name,
      gender: $stateParams.gender,
      cardNo: $stateParams.cardNo,
      type: '董事',
      person_id: $stateParams.person_id,
      changed_type: $stateParams.changed_type,
      memo: $stateParams.memo,
    }
  }

  function getDirectorys() {
    $http({
      method: 'GET',
      url: '/History/GetDirectory',
      params: {
        name: $scope.module.id,
        id: $scope.module.source_id
      }
    }).success(function(data) {
      data = data || [];
      $scope.holderList = data || [];
    });
  }
  getDirectorys();
};
