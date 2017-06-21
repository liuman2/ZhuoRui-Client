module.exports = function($scope, $http, $state, $stateParams, $timeout) {
  var shareholderId = $state.params.shareholderId || null;


  console.log($scope.data.currency)

  var jForm = $('#shareholder_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.shareholder = {
    id: '',
    changed_type: '',
    name: '',
    gender: '',
    cardNo: '',
    takes: '',
    type: '股东',
    person_id: '',
    memo: '',
  }

  console.log($scope.module.source_id)

  $scope.holderList = [];

  $scope.typeChange = function() {
    if ($scope.shareholder.changed_type != 'new') {
      return;
    }

    $scope.shareholder.person_id = '';
    $scope.shareholder.name = '';
    $scope.shareholder.gender = '';
    $scope.shareholder.cardNo = '';
    $scope.shareholder.takes = '';
  }

  $scope.personChange = function() {
    console.log($scope.shareholder.person_id)
    var holders = $.grep($scope.holderList, function(h, i) {
      return h.id == $scope.shareholder.person_id;
    });

    if (holders.length && holders[0].id != -1) {
      $scope.shareholder.name = holders[0].name;
      $scope.shareholder.gender = holders[0].gender;
      $scope.shareholder.cardNo = holders[0].cardNo;
      $scope.shareholder.takes = holders[0].takes;
    } else {
      $scope.shareholder.name = '';
      $scope.shareholder.gender = '';
      $scope.shareholder.cardNo = '';
      $scope.shareholder.takes = '';
    }
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('SHAREHOLDER_DONE', { shareholder: $scope.shareholder, index: $stateParams.index });
        $state.go('^');
      }
    });
  }

  $scope.checkDisabled = function(optionId) {
    var shareholderList = $scope.data.shareholderList || [];
    if (!shareholderList.length) {
      return false;
    }

    if ($scope.shareholder.person_id == optionId) {
      return false;
    }

    var selectedHolders = $.grep(shareholderList, function(s, i) {
      return s.person_id == optionId;
    });

    return selectedHolders.length > 0;
  }

  $scope.checkedSelected = function(personId, optionId) {
    return personId == optionId;
  }

  if (shareholderId) {
    $scope.shareholder = {
      id: $stateParams.shareholderId,
      name: $stateParams.name,
      gender: $stateParams.gender,
      cardNo: $stateParams.cardNo,
      takes: $stateParams.takes,
      type: '股东',
      person_id: $stateParams.person_id,
      changed_type: $stateParams.changed_type,
      memo: $stateParams.memo,
    }


  }

  function getShareHolders() {
    $http({
      method: 'GET',
      url: '/History/GetShareHolder',
      params: {
        name: $scope.module.id,
        id: $scope.module.source_id,
      }
    }).success(function(data) {
      data = data || [];

      // data.forEach(function(r) {
      //   r.disabled = checkSelected(r.id);
      // })

      // data.push({
      //   id: -1,
      //   name: '所要人员没在下拉列表中',
      //   disabled: false
      // });
      $scope.holderList = data || [];
    });
  }
  getShareHolders();
};
