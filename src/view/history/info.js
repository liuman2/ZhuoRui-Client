var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#change_form');

    $scope.changes = [];

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.action = null;
    switch ($state.current.name) {
        case 'history_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'history_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    $scope.module = {
        id: $state.params.module_id,
        source_id: $state.params.source_id,
        name: '',
        code: $state.params.code
    }

    var user = $cookieStore.get('USER_INFO');
    $scope.data = {
        id: '',
        customer_id: $state.params.customer_id,
        changes: [],
        amount_transaction: null,
        salesman_id: user.id,
        salesman: user.name,
        rate: ''
    }

    var fields = [];

    switch ($scope.module.id) {
        case 'abroad':
            $scope.data.source = 'reg_abroad';
            $scope.module.name = '境外注册';

            fields = [{
                key: 'name_cn',
                value: '公司中文名称',
                map: false
            }, {
                key: 'name_en',
                value: '公司英文名称',
                map: false
            }, {
                key: 'address',
                value: '公司注册地址',
                map: false
            }, {
                key: 'reg_no',
                value: '公司注册编号',
                map: false
            }, {
                key: 'director',
                value: '公司董事',
                map: false
            }, {
                key: 'others',
                value: '其他变更',
                map: false
            }];
            angular.copy(fields, $scope.changes);

            break;
        case 'internal':
            $scope.data.source = 'reg_internal';
            $scope.module.name = '境内注册';
            break;
        case 'trademark':
            $scope.data.source = 'trademark';
            $scope.module.name = '商标注册';
            break;
        case 'patent':
            $scope.data.source = 'patent';
            $scope.module.name = '专利注册';
            break;
    }

    if (!!id) {
        $scope.data.id = id;
        actionView();
    }

    $scope.add = function() {
        $scope.data.changes.push({
            key: '',
            value: ''
        });
    }

    $scope.remove = function(row) {
        var index = $scope.data.changes.indexOf(row);
        $scope.data.changes.splice(index, 1);

        for (var i = 0, max = fields.length; i < max; i++) {
            var field = fields[i];
            var cs =  $.grep($scope.data.changes, function(c, index) {
                return c.key == field.key;
            });
            $scope.changes[i].map = cs.length > 0;
        }
    }

    $scope.fieldChange = function() {

        for (var i = 0, max = fields.length; i < max; i++) {
            var field = fields[i];
            var cs =  $.grep($scope.data.changes, function(c, index) {
                return c.key == field.key;
            });
            $scope.changes[i].map = cs.length > 0;
        }
    }

    $scope.save = function() {
        var isCurrencyValid = valid_currency();
        jForm.isValid(function(v) {
            if (v) {
                if (!isCurrencyValid) {
                    return;
                }

                if ($scope.data.changes.length == 0) {
                    alert('您没输入任何变更数据');
                    return;
                }

                var tempChanges = angular.copy($scope.data.changes);
                $scope.data.order_code = $state.params.code;
                $scope.data.source_id =  $state.params.source_id;

                var changeObj = {};
                for (var i = 0, max = tempChanges.length; i < max; i++) {
                    var change = tempChanges[i];
                    if (!!change['key'] == true) {
                        changeObj[change['key']] = change['value'];
                    }
                }

                $scope.data.value = JSON.stringify(changeObj);

                if ($scope.data.value == '{}') {
                    alert('您没选择变更字段');
                    return;
                }

                var submitData = angular.copy($scope.data);
                submitData.date_transaction = $('#date_transaction').val();

                var url = $scope.action == 'add' ? '/History/Add' : '/History/Update';
                var data = submitData;
                if ($scope.action == 'add') {

                    if ($scope.data.is_old == 1) {
                        submitData.date_finish = $('#date_finish').val();
                    }

                    data = {
                        oldRequest: {
                            is_old: $scope.data.is_old
                        },
                        _history: submitData
                    };
                }
                $http({
                    method: 'POST',
                    url: url,
                    data: data
                }).success(function(data) {
                    // $state.go("history_view", { module_id: $scope.module.id, code: $scope.module.code });
                    $state.go("history", { module_id: $scope.module.id, code: $scope.module.code, source_id: $scope.module.source_id });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("history", { module_id: $scope.module.id, code: $scope.module.code, source_id: $scope.module.source_id });
        } else {
            $state.go("history_view", { id: id });
        }
    }

    $('#currencySelect2').on("change", function(e) {
        var currency = $(e.target).val();
        if (currency == "人民币") {
            $scope.data.rate = 1;
            $('input[name="rate"]').attr('disabled', true);
        } else {
            if (!id) {
                $scope.data.rate = '';
            } else {
                if (currency != rate_obj.currency) {
                    $scope.data.rate = '';
                } else {
                    $scope.data.rate = rate_obj.rate;
                }
            }
            $('input[name="rate"]').attr('disabled', false);
        }

        $scope.$apply();
    });

    var rate_obj = {
        rate: '',
        currency: ''
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/History/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data);

            if (data.date_transaction.indexOf('T') > -1) {
                data.date_transaction = data.date_transaction.split('T')[0];
            }
            var values = JSON.parse(data.value);

            data.changes = [];
            for (var o in values) {
                data.changes.push({
                    key: o,
                    value: values[o]
                })
            }

            $scope.data = data;
            $scope.fieldChange();
        });
    }

    function valid_currency() {
        if (!$scope.data.currency) {
            jForm.validator('showMsg', '#currencySelect2-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#currencySelect2-validator');
            return true;
        }
    }
};
