var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#abroad_form');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: true,
        step: 10,
        format: 'Y-m-d H:i',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.action = null;
    switch ($state.current.name) {
        case 'lecture_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'lecture_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    var user = $cookieStore.get('USER_INFO');

    $scope.data = {
        id: '',
        title: '',
        teacher: '',
        date_at: '',
        city: '',
        address: '',
        sponsor: '',
        co_sponsor: '',
        customer_target: ''
    }

    if (!!id) {
        $scope.data.id = id;
        actionView();
    }

    $scope.save = function() {

        jForm.isValid(function(v) {
            if (v) {

                var submitData = angular.copy($scope.data);
                submitData.date_at = $('#date_at').val();

                var url = $scope.action == 'add' ? '/Lecture/Add' : '/Lecture/Update';

                $http({
                    method: 'POST',
                    url: url,
                    data: submitData
                }).success(function(data) {
                    $state.go("lecture_view", {
                        id: data.id
                    });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("lecture");
        } else {
            $state.go("lecture_view", {
                id: id
            });
        }
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Lecture/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            if (data.date_at.indexOf('T') > -1) {
                data.date_at = data.date_at.split('T')[0];
            }

            $scope.data = data;
        });
    }
};
