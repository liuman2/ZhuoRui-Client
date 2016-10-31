module.exports = function($scope, $http, $state, $stateParams) {

  var jForm = $('#coding_form');
  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {}
  });

  $scope.data = {};

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $http({
          method: 'POST',
          url: '/Settings/PeriodUpdate',
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
      url: '/Settings/GetPeriod'
    }).success(function(data) {
      data.patent_period = data.patent_period - 0;
      data.trademark_period = data.trademark_period - 0;
      $scope.data = data;
    });
  }

  load_data();
}
