var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null,
        jForm = $('.form-horizontal');

    $scope.action = null;

    switch ($state.current.name) {
        case 'abroad_add':
            $scope.action = 'add';
            $scope.current_bread = '新增';
            break;
        case 'abroad_edit':
            $scope.action = 'update';
            $scope.current_bread = '修改';
            break;
        default:
            break;
    }

    $scope.data = {
        industry: '',
        province: '',
        city: '',
        county: '',
        contact: '',
        mobile: '',
        customer_address: '',
        tel: ''
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

        if (select_customers.length) {
            $scope.data.industry = select_customers[0].industry;
            $scope.data.province = select_customers[0].province;
            $scope.data.city = select_customers[0].city;
            $scope.data.county = select_customers[0].county;
            $scope.data.customer_address = select_customers[0].address;
            $scope.data.contact = select_customers[0].contact;
            $scope.data.mobile = select_customers[0].mobile;
            $scope.data.tel = select_customers[0].tel;
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
};
