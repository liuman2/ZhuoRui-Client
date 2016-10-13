module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = [];

    function load_data() {
        $http({
            method: 'GET',
            url: '/Role/List'
        }).success(function(data) {
            $scope.data = data;
        });
    }

    $scope.delete = function(item) {
        if (item.is_system == 1) {
            $.alert({
                title: false,
                content: '系统默认角色不可删除',
                confirmButton: '确定'
            });
            return;
        }

        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Role/Delete',
                    params: {
                        id: item.id
                    }
                }).success(function(data) {
                    load_data();
                });
            }
        });
    }

    $scope.$on('ROLE_MODAL_DONE', function(e) {
        load_data();
    });

    load_data();
}
