module.exports = function($scope, $http, $state, $stateParams) {

  var jForm = $('#coding_form');
  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {}
  });

  $scope.data = {};

  $scope.getExample = function(suffix, code) {
    var zero = '';
    for (var i = 0; i < suffix - 1; i++) {
      zero += '0';
    }

    return '(例：' + code + zero + '1)';
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $http({
          method: 'POST',
          url: '/Settings/Update',
          needLoading: true,
          data: $scope.data
        }).success(function(data) {
          load_data();
          $.alert({
            title: false,
            content: '保存成功',
            confirmButton: '确定'
          });
        });
      }
    });
  }

  function load_data() {
    $http({
      method: 'GET',
      url: '/Settings/Get'
    }).success(function(data) {
      $scope.data = data;
    });
  }

  load_data();
}
