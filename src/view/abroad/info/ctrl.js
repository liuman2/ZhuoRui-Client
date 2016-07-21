module.exports = function($scope, $state, $http, $timeout) {
    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $('#ddlCustomers').select2({
        placeholder: "请选择",
        data: [{
            id: 1,
            text: '厦门a公司'
        },{
            id: 2,
            text: '厦门b公司'
        },{
            id: 3,
            text: '厦门c公司'
        }],
        language: "zh-CN"
    });
};
