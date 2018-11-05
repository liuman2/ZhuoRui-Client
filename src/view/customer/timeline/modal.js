module.exports = function ($scope, $state, $http, $timeout) {
    var customer_id = $state.params.id,
        tid = $state.params.tid || null,
        dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        maxDate: new Date(),
        scrollInput: false,
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
        date_business: '',
        is_notify: false,
        date_notify: '',
        dealt_date: '',
    }

    $scope.notifyChange = function () {
        if ($scope.timeline.is_notify) {
            $timeout(function () {
                var date_notify = $('#date_notify');
                var dealt_date = $('#dealt_date');
                date_notify.datetimepicker({
                    timepicker: false,
                    format: 'Y-m-d',
                    scrollInput: false,
                    minDate: new Date(),
                });
                dealt_date.datetimepicker({
                    timepicker: false,
                    format: 'Y-m-d',
                    scrollInput: false,
                    minDate: new Date(),
                });
            });
        }
    }

    $scope.save = function () {
        jForm.isValid(function (v) {
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
        }).success(function (data) {
            if (data.date_business.indexOf('T') > -1) {
                data.date_business = data.date_business.split('T')[0];
            }

            $scope.timeline = data;
        });
    }

    function actionAdd() {
        $scope.timeline.date_business = $('#date_business').val();
        if ($scope.timeline.is_notify) {
            $scope.timeline.date_notify = $('#date_notify').val();
            $scope.timeline.dealt_date = $('#dealt_date').val();

            var notifyPeople = $('#notifyPeople').val();
            if (notifyPeople) {
                $scope.timeline.notifyPeople = notifyPeople.join(',');
            }
        }
        $http({
            method: 'POST',
            url: '/CustomerTimeline/Add',
            needLoading: true,
            data: $scope.timeline
        }).success(function (data) {
            $scope.$emit('R_TIMELINE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionUpdate() {
        $scope.timeline.date_business = $('#date_business').val();

        if ($scope.timeline.is_notify) {
            var notifyPeople = $('#notifyPeople').val();
            if (notifyPeople) {
                $scope.timeline.notifyPeople = notifyPeople.join(',');
            }
        }

        $http({
            method: 'POST',
            url: '/CustomerTimeline/Update',
            needLoading: true,
            data: $scope.timeline
        }).success(function (data) {
            $scope.$emit('R_TIMELINE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
