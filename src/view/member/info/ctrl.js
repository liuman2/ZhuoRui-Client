var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $timeout) {

    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('.form-horizontal');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        scrollInput: false,
        onChangeDateTime: function (current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.action = null;
    switch ($state.current.name) {
        case 'member_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'member_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

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

    if ($scope.action != 'add') {
        $http({
            method: 'GET',
            params: {
                id: id
            },
            url: '/Member/Get'
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("member");
        } else {
            $state.go("member_view", {
                id: id
            });
        }
    }

    $scope.save = function() {
        var jForm = $('#member_form');
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
                    url: url,
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
