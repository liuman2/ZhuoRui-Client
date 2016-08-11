var httpHelper = require('js/utils/httpHelper');

module.exports = function($scope, $state, $http, $timeout) {
    var module_name = $state.params.module_name,
        id = $state.params.id || null;


    var jForm = $('#audit_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.audit = {
        id: id,
        description: ''
    }

    $scope.save = function() {
        jForm.isValid(function(v) {
            if (v) {
                actionAdd();
            }
        });
    }

    function actionAdd() {
        $http({
            method: 'POST',
            url: '/'+ module_name +'/RefuseAudit',
            data: $scope.income
        }).success(function(data) {
            if (!data.success) {
                alert(data.message || '保存失败')
                return;
            }

            $scope.$emit('REFUSE_MODAL_DONE');
            $state.go('^', {
                reload: true
            });
        });
    }
};
