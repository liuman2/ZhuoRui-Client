module.exports = function($scope, $http, $state, $stateParams) {

  var jForm = $('#coding_form');
  jForm.validator({
    theme: 'yellow_right',
    rules: {},
    fields: {}
  });

  $scope.data = {};

  // $scope.old = function() {
  //   $http({
  //     method: 'GET',
  //     url: '/Timeline/UpdateOldData',
  //   }).success(function(data) {
  //   });
  // }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        var submitData = [];
        for (var o in $scope.data) {
          var obj = {
            name: o,
            value: $scope.data[o],
            memo: $('#' + o).find("option:selected").text()
          };
          submitData.push(obj)
        }

        $http({
          method: 'POST',
          url: '/Settings/ParamUpdate',
          needLoading: true,
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
        settings[row.name + '_' + 'NAME'] = row.memo;
      }
      $scope.data = settings;
    });
  }

  load_data();
}
