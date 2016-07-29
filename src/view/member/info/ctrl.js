var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('.form-horizontal');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onChangeDateTime: function (current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.data = {
        id: '',
        organization_id: null,
        area_id: null,
        position_id: null,
        username: '',
        name: '',
        english_name: '',
        mobile: '',
        hiredate: '',
        birthday: '',
        status: ''
    }

    jForm.validator({
        rules: {
            account: [/^\w{3,12}$/, "由3-12位数字、字母或下划线组成"]
        },
        fields: {
            username: "required; length[~12]; account; remote[get:" + httpHelper.url('/Member/ExistUsername?') + ($scope.action == 'add' ? "" : "id=" + id) + "]",
        }
    });

    $scope.cancel = function() {
        $state.go('member');
    }

    $scope.save = function() {
        var jForm = $('.form-horizontal');
        jForm.isValid(function(v) {
            if (v) {
                var isDeptOk = valid_department();
                var isAreaOk = valid_area();
                if (!isDeptOk || !isAreaOk) { return; }

                $scope.data.birthday = $('#birthday').val();
                $scope.data.hiredate = $('#hiredate').val();

                var url = $scope.action == 'add' ? '/Member/Add' : '/Member/Update';

                $http({
                    method: 'POST',
                    url: '/Member/Add',
                    data: $scope.data
                }).success(function(data) {
                    $state.go('member');
                });
            }
        });
    }

    function valid_department() {
        console.log($scope.data.organization_id)
        if (!$scope.data.organization_id) {
            jForm.validator('showMsg', '#department-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#department-validator');
            return true;
        }
    }

    function valid_area() {
        if (!$scope.data.area_id) {
            jForm.validator('showMsg', '#area-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#area-validator');
            return true;
        }
    }
};
