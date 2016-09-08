var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#letter_form');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        step: 10,
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.action = null;
    switch ($state.current.name) {
        case 'letter_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'letter_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    var user = $cookieStore.get('USER_INFO');

    $scope.data = {
        id: '',
        type: '',
        owner: '',
        letter_type: '',
        merchant: '',
        code: '',
        date_at: '',
        description: '',
        file_url: ''
    }

    $scope.getOwnerName = function() {
        switch($scope.data.type) {
            case '收件':
                return '收件人';
            case '寄件':
                return '寄件人';
            default:
                return '收/寄人';
        }
    }

    $scope.getDateName = function() {

        switch($scope.data.type) {
            case '收件':
                return '收件日期';
            case '寄件':
                return '寄件日期';
            default:
                return '收/寄日期';
        }
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

                var url = $scope.action == 'add' ? '/Letter/Add' : '/Letter/Update';

                $http({
                    method: 'POST',
                    url: url,
                    data: submitData
                }).success(function(data) {
                    $state.go("letter_view", {
                        id: data.id
                    });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("letter");
        } else {
            $state.go("letter_view", {
                id: id
            });
        }
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Letter/Get',
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
