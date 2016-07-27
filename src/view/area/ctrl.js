module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = [];

    function load_data() {
        $http({
            method: 'GET',
            url: '/Area/List'
        }).success(function(data) {
            $scope.data = data;
        });
    }

    $scope.delete = function(id) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Area/Delete',
            params: {
                id: id
            }
        }).success(function(data) {
            load_data();
        });
    }

    $scope.$on('AREA_MODAL_DONE', function(e) {
        load_data();
    });

    load_data();
}
