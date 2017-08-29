module.exports = function($scope, $state, $http, $timeout) {
  var tid = $state.params.tid || null,
    dInput = $('.date-input');

  $.datetimepicker.setLocale('ch');
  dInput.datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    scrollInput: false,
    // maxDate: new Date(),
    onChangeDateTime: function(current_time, $input) {
      console.log(current_time)
    }
  });

  var jForm = $('.form-horizontal');
  jForm.validator({
    rules: {},
    fields: {}
  });

  $scope.timelineModal = {
    id: null,
    source_id: $state.params.id,
    source_name: $state.params.name,
    title: '',
    content: '',
    date_business: '',
    log_type: '',
  }

  $scope.save = function() {
    jForm.isValid(function(v) {
      if (v) {
        if (tid) {
          actionUpdate();
        } else {
          actionAdd();
        }
      }
    });
  }

  $scope.title = !!tid ? '修改日志' : '添加日志'
  if (tid) {
    actionView();
  }

  function actionView() {
    $http({
      method: 'GET',
      url: '/Timeline/Get',
      params: {
        id: tid
      }
    }).success(function(data) {
      if (data.date_business.indexOf('T') > -1) {
        data.date_business = data.date_business.split('T')[0];
      }

      $scope.timelineModal = data;
    });
  }

  function actionAdd() {
    $scope.timelineModal.date_business = $('#date_business').val();
    $http({
      method: 'POST',
      url: '/Timeline/Add',
      needLoading: true,
      data: $scope.timelineModal
    }).success(function(data) {
      $scope.$emit('R_TIMELINE_MODAL_DONE');
      $state.go('^', { reload: true });
    });
  }

  function actionUpdate() {
    $scope.timelineModal.date_business = $('#date_business').val();
    $http({
      method: 'POST',
      url: '/Timeline/Update',
      needLoading: true,
      data: $scope.timelineModal
    }).success(function(data) {
      $scope.$emit('R_TIMELINE_MODAL_DONE');
      $state.go('^', { reload: true });
    });
  }
};
