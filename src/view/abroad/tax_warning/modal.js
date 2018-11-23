module.exports = function ($scope, $state, $http, $timeout) {
    var order_id = $state.params.orderId,
        code = $state.params.code,
        name_cn = $state.params.name_cn,
        name_en = $state.params.name_en,
        end_date = $state.params.end_date,
        tax_record_id = $state.params.tax_record_id,
        dInput = $('.date-input');

    if (end_date && end_date.indexOf('T') > -1) {
        end_date = end_date.split('T')[0];
    }

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        scrollInput: false,
        // maxDate: new Date(),
        onChangeDateTime: function (current_time, $input) {
        }
    });

    var jForm = $('#tax_modal');
    jForm.validator({
        rules: {},
        fields: {
            sent_date: "发出时间:match[lte, end_date, date];",
            end_date: "截止时间:match[gte, sent_date, date]; required;",
        }
    });

    $scope.getDisabled = function(tax_record_id) {
        if (tax_record_id) {
            return true;
        }
        return false;
    }

    $scope.data = {
        order_id: order_id,
        code: code,
        name_cn: name_cn,
        name_en: name_en,
        end_date: end_date,
        tax_record_id: tax_record_id,
    }

    $scope.save = function () {
        jForm.isValid(function (v) {
            if (v) {
                if ($scope.data.tax_record_id) {
                    actionEdit();
                } else {
                    actionAdd();
                }
                
            }
        });
    }

    function actionAdd() {
        $scope.data.sent_date = $('#sent_date').val();
        $scope.data.end_date = $('#end_date').val();
        $http({
            method: 'POST',
            url: '/RegAbroad/InsertTaxDate',
            data: $scope.data,
            needLoading: true,
        }).success(function (data) {
            $scope.$emit('TAX_DATE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function actionEdit() {
        $scope.data.sent_date = $('#sent_date').val();
        $scope.data.end_date = $('#end_date').val();

        if (!$scope.data.sent_date) {
            $scope.$emit('TAX_DATE_MODAL_DONE');
            $state.go('^', { reload: true });
            return;
        }
        $http({
            method: 'POST',
            url: '/RegAbroad/UpdateTaxDate',
            data: $scope.data,
            needLoading: true,
        }).success(function (data) {
            $scope.$emit('TAX_DATE_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }
};
