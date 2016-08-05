module.exports = function($scope, $state, $http, $timeout) {
    var customer_id =  $state.params.id,
        tid = $state.params.tid || null,
        dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        maxDate: new Date(),
        onChangeDateTime: function (current_time, $input) {
            console.log(current_time)
        }
    });

    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.timeline = {
        id: null,
        customer_id: customer_id,
        title: '',
        content: '',
        date_business: ''
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
            url: '/CustomerTimeline/Get',
            params: {
                id: tid
            }
        }).success(function(data) {
            if (data.date_business.indexOf('T') > -1) {
                data.date_business = data.date_business.split('T')[0];
            }

            $scope.timeline = data;
        });
    }

    function actionAdd() {
        $scope.timeline.date_business = $('#date_business').val();
        $http({
            method: 'POST',
            url: '/CustomerTimeline/Add',
            data: $scope.timeline
        }).success(function(data) {
            $scope.$emit('R_TIMELINE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $scope.timeline.date_business = $('#date_business').val();
        $http({
            method: 'POST',
            url: '/CustomerTimeline/Update',
            data: $scope.timeline
        }).success(function(data) {
            $scope.$emit('R_TIMELINE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
