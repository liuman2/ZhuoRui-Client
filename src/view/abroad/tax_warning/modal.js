module.exports = function ($scope, $state, $http, $timeout) {
    var order_id = $state.params.orderId,
        code = $state.params.code,
        name_cn = $state.params.name_cn,
        name_en = $state.params.name_en,
        dInput = $('.date-input');

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
            sent_date: "发出时间:match[lt, end_date, date]; required;",
            end_date: "截止时间:match[gt, sent_date, date]; required;",
        }
    });

    $scope.data = {
        order_id: order_id,
        code: code,
        name_cn: name_cn,
        name_en: name_en,
    }

    $scope.save = function () {
        jForm.isValid(function (v) {
            if (v) {
                actionAdd();
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
};
