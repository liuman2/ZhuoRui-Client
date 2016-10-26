// require('libs/bootstrap-wysiwyg/src/bootstrap-wysiwyg');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {

  // $('#editor').wysiwyg();

  $scope.onReady = function() {


  };

  // $timeout(function() {
  //   $('#editor').wysiwyg();
  // }, 1000)

  $(".textarea").wysihtml5();

};
