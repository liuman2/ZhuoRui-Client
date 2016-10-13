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

    $scope.$on('R_TIMELINE_MODAL_DONE', function(e) {
        getTimeline();
    });

    $scope.delete = function(item) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
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
        });
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
                id: id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }
};
