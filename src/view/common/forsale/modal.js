var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
  var order_id = $state.params.order_id,
    order_type = $state.params.order_type;


  var jForm = $('#forsale_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.resell_price = null;

  $scope.save = function(e) {
    jForm.isValid(function(v) {
      if (v) {
        $http({
          method: 'POST',
          url: '/Annual/ForSale',
          needLoading: true,
          data: {
            order_id: order_id,
            order_type: order_type,
            resell_price: $scope.resell_price,
          }
        }).success(function(data) {

          $scope.$emit('FORSALE_MODAL_DONE');
          $state.go('^', {
            reload: true
          });
        });
      }
    });
  }
};
