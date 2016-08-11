var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $timeout) {
    var source_id = $state.params.id,
        code = $state.params.code,
        from = $state.params.source,
        source_name = $state.params.name;

    $scope.timeline = {
        title: '',
        sref: '',
        code: code
    };

    switch (source_name) {
        case 'reg_abroad':
            $scope.timeline.title = '境外注册';
            if (from == 'list') {
                $scope.timeline.sref = 'abroad';
            } else {
                $scope.timeline.sref = 'abroad_view({id: ' + source_id + '})';
            }
            break;
    }

    $scope.data = {
        items: []
    };

    $scope.format = function(dt, str) {
        return moment(dt).format(str);
    }

    function getTimeline() {
        $http({
            method: 'GET',
            url: '/Timeline/GetTimelines',
            params: {
                source_id: source_id,
                source_name: source_name
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    getTimeline();
};
