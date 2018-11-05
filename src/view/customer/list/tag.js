module.exports = function ($scope, $state, $http) {
  var customerId = $state.params.customerId || null;
  var tags = $state.params.tags || '';
  var jForm = $('#tag_modal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  var customerTags = tags.split(',') || [];
  // if (tags) {
  //   var cts = tags.split(',');
  //   if (cts.length) {
  //     cts.forEach(tag => {
  //       customerTags.push({
  //         tag,
  //       });
  //     });
  //   }
  // } else {
  //   customerTags = [{
  //     tag: '',
  //   }];
  // }

  // $scope.customerTag = {
  //   tags: customerTags,
  // };

  $('#customerTag').select2({
    language: "zh-CN",
    placeholder: "",
    maximumSelectionSize: 8,
    data: $scope.tagList || []
  });

  if (customerTags.length) {
    $("#customerTag").val(customerTags).trigger("change");
  }

  $scope.addTag = function () {
    $scope.customerTag.tags.push({
      tag: '',
    });
  }

  $scope.removeTag = function (index) {
    $scope.customerTag.tags.splice(index, 1);
  }

  $scope.save = function () {
    jForm.isValid(function (v) {
      if (v) {
        // var temp = [];
        // if ($scope.customerTag.tags.length) {
        //   $scope.customerTag.tags.forEach(tag => {
        //     temp.push(tag.tag);
        //   });
        // }
        $http({
          method: 'POST',
          url: '/Customer/UpdateTag',
          needLoading: true,
          data: {
            id: customerId,
            tag: $('#customerTag').val() !== null ? $('#customerTag').val().join(',') : '', // temp.join(','),
          }
        }).success(function (data) {
          $scope.$emit('TAG_DONE');
          $state.go('^', { reload: true });
        });
      }
    });
  }

  $scope.title = '添加标签';
};
