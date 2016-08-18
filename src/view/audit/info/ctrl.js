var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $cookieStore, $timeout) {
    var id = $state.params.id || null,
        dInput = $('.date-input'),
        jForm = $('#audit_form');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    jForm.validator({
        rules: {},
        fields: {
            account_period: {
                rule: "账期:match[lt, date_year_end, date];"
            },
            date_year_end: {
                rule: "年结日:match[gt, account_period, date]"
            }
        }
    });

    $scope.action = null;

    switch ($state.current.name) {
        case 'audit_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'audit_edit':
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
        industry: '',
        province: '',
        city: '',
        county: '',
        business_nature: '',
        contact: '',
        mobile: '',
        customer_address: '',
        tel: '',
        is_open_bank: 0,
        salesman_id: user.id,
        salesman: user.name,
        accountant_id: '',
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
        var isAccountantVaild = valid_accountant();
        var isCurrencyValid = valid_currency();
        jForm.isValid(function(v) {
            if (v) {
                if (!isCustomerValid || !isAccountantVaild || !isCurrencyValid) {
                    return;
                }

                var submitData = angular.copy($scope.data);

                submitData.date_setup = $('#date_setup').val();
                submitData.account_period = $('#account_period').val();
                submitData.date_year_end = $('#date_year_end').val();
                submitData.date_transaction = $('#date_transaction').val();

                var url = $scope.action == 'add' ? '/Audit/Add' : '/Audit/Update';
                $http({
                    method: 'POST',
                    url: url,
                    data: submitData
                }).success(function(data) {
                    $state.go("audit_view", {
                        id: data.id
                    });
                });
            }
        });
    }

    $scope.cancel = function() {
        if ($scope.action == 'add') {
            $state.go("audit");
        } else {
            $state.go("audit_view", {
                id: id
            });
        }
    }

    $('#customerSelect2').on("change", function(e) {
        var customer_id = $(e.target).val();

        $scope.banks = [];
        setBanks(customer_id);

        var customers = $('#customerSelect2').select2('data');
        var select_customers = $.grep(customers, function(c) {
            return c.id == customer_id;
        });

        if (select_customers.length && select_customers[0].industry != undefined) {
            $scope.data.industry = select_customers[0].industry;
            $scope.data.business_nature = select_customers[0].business_nature;
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

    function actionView() {
        $http({
            method: 'GET',
            url: '/Audit/Get',
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
            if (data.account_period && data.account_period.indexOf('T') > -1) {
                data.account_period = data.account_period.split('T')[0];
            }
            if (data.date_year_end && data.date_year_end.indexOf('T') > -1) {
                data.date_year_end = data.date_year_end.split('T')[0];
            }

            $scope.data = data;
        });
    }

    function setBanks(customer_id) {
        $http({
            url: 'Customer/Banks',
            params: {
                customer_id: customer_id
            }
        }).success(function(data) {
            $scope.banks = data.items || [];
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

    function valid_accountant() {
        if (!$scope.data.accountant_id) {
            jForm.validator('showMsg', '#accountantSelect2-validator', {
                type: "error",
                msg: "此处不能为空"
            });
            return false;
        } else {
            jForm.validator('hideMsg', '#accountantSelect2-validator');
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
