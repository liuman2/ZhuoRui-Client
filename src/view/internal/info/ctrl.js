var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#internal_form');

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
        case 'internal_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'internal_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    $scope.data = {
        id: '',
        industry: '',
        province: '',
        city: '',
        county: '',
        contact: '',
        mobile: '',
        customer_address: '',
        tel: '',
        salesman: $scope.userInfo.name,
        waiter_id: '',
        outworker_id: '',
        manager_id: '',
        customer_id: '',
        invoice_name: '',
        invoice_tax: '',
        invoice_address: '',
        invoice_tel: '',
        invoice_bank: '',
        invoice_account: ''
    }

    if (!!id) {
        $scope.data.id = id;
        actionView();
    }

    $scope.save = function() {
        var isCustomerValid = valid_customer();
        var isWaiterVaild = valid_waiter();
        var isCurrencyValid = valid_currency();
        jForm.isValid(function(v) {
            if (v) {
                if (!isCustomerValid || !isWaiterVaild || !isCurrencyValid) {
                    return;
                }
                var submitData = angular.copy($scope.data);
                submitData.date_setup = $('#date_setup').val();
                submitData.date_transaction = $('#date_transaction').val();
                var url = $scope.action == 'add' ? '/RegInternal/Add' : '/RegInternal/Update';
                $http({
                    method: 'POST',
                    url: url,
                    data: submitData
                }).success(function(data) {
                    $state.go("internal_view", {
                        id: data.id
                    });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("internal");
        } else {
            $state.go("internal_view", {
                id: id
            });
        }
    }

    $('#customerSelect2').on("change", function(e) {
        var customer_id = $(e.target).val();

        $('#customerBankSelect2').attr('paramvalue', customer_id);
        setBanks();

        $('#customerBankSelect2').val(null).trigger("change");
        $scope.data.holder = '';
        $scope.data.account = '';

        var customers = $('#customerSelect2').select2('data');
        var select_customers = $.grep(customers, function(c) {
            return c.id == customer_id;
        });

        if (select_customers.length && select_customers[0].industry != undefined) {
            $scope.data.industry = select_customers[0].industry;
            $scope.data.province = select_customers[0].province;
            $scope.data.city = select_customers[0].city;
            $scope.data.county = select_customers[0].county;
            $scope.data.customer_address = select_customers[0].address;
            $scope.data.contact = select_customers[0].contact;
            $scope.data.mobile = select_customers[0].mobile;
            $scope.data.tel = select_customers[0].tel;

            // if (!$scope.data.invoice_name.length) {
            //     $scope.data.invoice_name = select_customers[0].name;
            // }
            // if (!$scope.data.invoice_address) {
            //     $scope.data.invoice_address = select_customers[0].address;
            // }
            // if (!$scope.data.invoice_tel) {
            //     $scope.data.invoice_tel = select_customers[0].tel || select_customers[0].mobile;
            // }

            $scope.$apply();
        }
    });

    $('#customerBankSelect2').on("change", function(e) {
        var bank_id = $(e.target).val();

        var banks = $('#customerBankSelect2').select2('data');
        var select_banks = $.grep(banks, function(b) {
            return b.id == bank_id;
        });

        if (select_banks.length) {
            $scope.data.holder = select_banks[0].holder;
            $scope.data.account = select_banks[0].account;
            $scope.$apply();
        }
    });

    function actionView() {
        $http({
            method: 'GET',
            url: '/RegInternal/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            if (data.date_setup.indexOf('T') > -1) {
                data.date_setup = data.date_setup.split('T')[0];
            }
            if (data.date_transaction.indexOf('T') > -1) {
                data.date_transaction = data.date_transaction.split('T')[0];
            }
            $scope.data = data;
        });
    }

    function setBanks() {
        $('#customerBankSelect2').select2({
            language: "zh-CN",
            placeholder: "",
            maximumSelectionSize: 8,
            ajax: {
                url: httpHelper.url('Customer/Banks'),
                type: 'GET',
                dataType: 'json',
                data: function(params) {
                    return {
                        customer_id: $('#customerBankSelect2').attr('paramvalue'),
                        name: params.term || ''
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1;
                    $.map(data.items, function(item) {
                        item.text = item.name;
                    });
                    return {
                        results: data.items,
                        pagination: {
                            more: false
                        }
                    };
                }
            }
        });
    }

    function valid_customer() {
        if (!$scope.data.customer_id) {
            jForm.validator('showMsg', '#customerSelect2-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#customerSelect2-validator');
            return true;
        }
    }

    function valid_waiter() {
        if (!$scope.data.waiter_id) {
            jForm.validator('showMsg', '#waiterSelect2-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#waiterSelect2-validator');
            return true;
        }
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
