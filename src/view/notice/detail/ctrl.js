module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
  var id = $state.params.id || null;


  if (!!id) {
    actionView();
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Notice/Get',
      params: {
        id: id
      }
    }).success(function(data) {
      if (data.code) {
        data.title = data.title + ' (' + data.code +')';
      }

      $scope.data = data;
    });
  }
};
