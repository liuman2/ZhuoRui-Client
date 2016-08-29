var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#annual_form');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    var order_type = $state.params.order_type,
        order_id = $state.params.order_id;

    if (order_id && order_type) {
        getBusinessOrder();
    }

    $scope.action = 'add';

    switch ($state.current.name) {
        case 'annual_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'annual_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    var user = $cookieStore.get('USER_INFO');

    $scope.data = {
        id: '',
        customer_id: '',
        customer_name: '',
        customer_code: '',
        order_id: '',
        type: order_type,
        order_type_name: '',
        order_code: '',
        name_cn: '',
        name_en: '',
        salesman_id: user.id,
        salesman: user.name,
        currency: '',
        rate: '',
        accountant_id: ''
    }


    if (!!id) {
        $scope.action = 'update';
        $scope.data.id = id;
        actionView();
    }

    $scope.save = function() {
        var isCurrencyValid = valid_currency();
        jForm.isValid(function(v) {
            if (v) {
                if (!isCurrencyValid) {
                    return;
                }

                var submitData = angular.copy($scope.data);

                submitData.date_transaction = $('#date_transaction').val();

                var url = $scope.action == 'add' ? '/Annual/Add' : '/Annual/Update';
                $http({
                    method: 'POST',
                    url: url,
                    data: submitData
                }).success(function(data) {
                    $state.go("annual_view", {
                        id: data.id
                    });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("annual_warning");
        } else {
            $state.go("annual_view", {
                id: id
            });
        }
    }

    function getBusinessOrder() {
        $http({
            method: 'GET',
            url: '/Annual/GetBusinessOrder',
            params: {
                orderId: order_id,
                orderType: order_type
            }
        }).success(function(data) {
            console.log(data);

            $scope.data.customer_id = data.customer_id;
            $scope.data.customer_name = data.customer_name;
            $scope.data.customer_code = data.customer_code;

            $scope.data.order_id = data.order_id;
            $scope.data.order_type_name = data.order_type_name;
            $scope.data.order_code = data.order_code;
            $scope.data.name_cn = data.name_cn;
            $scope.data.name_en = data.name_en;

        });
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
            url: '/Annual/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            if (data.date_transaction.indexOf('T') > -1) {
                data.date_transaction = data.date_transaction.split('T')[0];
            }

            switch (data.type)
            {
                case "reg_abroad":
                    data.order_type_name = "境外注册";
                    break;
                case "reg_internal":
                    data.order_type_name = "境内注册";
                    break;
                case "audit":
                    data.order_type_name = "年审";
                    break;
                case "trademark":
                    data.order_type_name = "商标注册";
                    break;
                case "patent":
                    data.order_type_name = "专利注册";
                    break;
                default:
                    break;
            }

            $scope.data = data;

            var temp_rate = {
                rate: $scope.data.rate,
                currency: $scope.data.currency
            }

            angular.copy(temp_rate, rate_obj);
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
