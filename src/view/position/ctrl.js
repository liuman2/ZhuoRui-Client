module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = [];

    function load_data() {
        $http({
            method: 'GET',
            url: '/Position/List'
        }).success(function(data) {
            $scope.data = data;
        });
    }

    $scope.delete = function(id) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Position/Delete',
                    params: {
                        id: id
                    }
                }).success(function(data) {
                    load_data();
                });
            }
        });
    }

    $scope.$on('POSITION_MODAL_DONE', function(e) {
        load_data();
    });

    load_data();
}
