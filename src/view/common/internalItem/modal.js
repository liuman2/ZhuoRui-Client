module.exports = function($scope, $state, $stateParams, $http, $timeout) {
  var index = $state.params.index || null;


  // console.log($scope.data.currency)

  var jForm = $('#internalitem_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.price = {
    name: '',
    material: '',
    spend: '',
    price: '',
    memo: '',
  }

  $scope.regItems = [];

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        $scope.$emit('ITEM_DONE', { price: $scope.price, index: index });
        $state.go('^');
      }
    });
  }

  $scope.title = !!index ? '修改委托事项' : '添加委托事项'
  if (index) {
    $scope.price = {
      name: $stateParams.name,
      material: $stateParams.material,
      spend: $stateParams.spend,
      price: $stateParams.price,
      memo: $stateParams.memo,
    }
  }

  $http({
    method: 'GET',
    url: 'Dictionary/DroplistByGroup',
    params: {
      group: '委托事项',
    }
  }).success(function(data) {
    $scope.regItems = data.items || [];
    $timeout(function() {
      $('#priceItems').val($scope.price.name);
    })

    // $(".selector").find("option[text='pxx']").attr("selected",true);
  });
};
