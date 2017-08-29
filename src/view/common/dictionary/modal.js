module.exports = function($scope, $state, $http, $timeout) {
    var group =  $state.params.group;
console.log(group)
    var jForm = $('#dictionary_modal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.dictionary = {
        group: group,
        name: ''
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
            url: '/Dictionary/Add',
            needLoading: true,
            data: $scope.dictionary
        }).success(function(data) {
            $state.go('^');
        });
    }
};
