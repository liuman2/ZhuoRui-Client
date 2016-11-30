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
        var submitData = [];
        for (var o in $scope.data) {
          submitData.push({
            name: o,
            value: $scope.data[o]
          })
        }
        $http({
          method: 'POST',
          url: '/Settings/PeriodUpdate',
          data: submitData
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
      url: '/Settings/GetParams'
    }).success(function(data) {
      var settings = {};
      for (var i = 0, max = data.length; i < max; i++) {
        var row = data[i];
        settings[row.name] = row.value;
      }
      $scope.data = settings;
    });
  }

  load_data();
}
