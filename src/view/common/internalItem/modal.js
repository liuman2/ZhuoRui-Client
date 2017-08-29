module.exports = function($scope, $state, $stateParams, $http, $timeout) {
  var index = $state.params.index || null;


  // console.log($scope.data.currency)

  var jForm = $('#internalitem_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.price = {
    itemId: '',
    name: '',
    material: '',
    spend: '',
    price: '',
    memo: '',
  }

  $scope.regItems = [];

  $scope.save = function() {

    jForm.isValid(function(v) {
      if (!checkNameExist()) {
        $.alert({
          title: false,
          content: '该委托事项已存在',
          confirmButton: '确定'
        });
        return;
      }
      if (v) {
        if ($state.current.name == 'internal_view.item_add') {

          var total = $scope.getTotal();
          $http({
            method: 'POST',
            url: '/RegInternal/AddRegItem',
            needLoading: true,
            data: {
              id: $scope.data.id,
              item: $scope.price,
              amount_transaction: total
            }
          }).success(function(data) {
            $scope.price.id = data.id;
            $scope.priceList.push($scope.price);
            $scope.data.amount_transaction = total;
            $state.go('^');
          });
          return;
        }
        $scope.$emit('ITEM_DONE', { price: $scope.price, index: index });
        $state.go('^');
      }
    });
  }

  function checkNameExist() {
    if (!$scope.priceList.length) {
      return true;
    }

    var arrs = $scope.priceList.filter(function(item, i) {
      return item.name == $scope.price.name && (index == null || i != (index - 0));
    });

    return arrs.length == 0;
  }

  $scope.title = !!index ? '修改委托事项' : '添加委托事项'
  if (index) {
    $scope.price = {
      itemId: $stateParams.itemId,
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
