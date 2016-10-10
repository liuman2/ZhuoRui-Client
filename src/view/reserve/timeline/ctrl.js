var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null

    $scope.data = {
        customer: {
            id: id,
            name: ''
        },
        items: []
    }

    $scope.search = {
        name: ''
    }

    $scope.$on('R_TIMELINE_MODAL_DONE', function(e) {
        getTimeline();
    });

    $scope.delete = function(item) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/CustomerTimeline/Delete',
            params: {
                id: item.id
            }
        }).success(function(data) {
            getTimeline();
        });
    }

    $scope.query = function() {
        getTimeline();
    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.fromNow = function(dt) {
        return moment(dt, "YYYY-MM-DD HH:mm:ss").fromNow();
    }

    if (id) {
        getTimeline();
    }

    function getTimeline() {
        $http({
            method: 'GET',
            url: '/CustomerTimeline/GetTimelines',
            params: {
                id: id,
                name: $scope.search.name
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }
};
