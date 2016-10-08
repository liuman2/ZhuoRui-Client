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
        case 'reg_internal':
            $scope.timeline.title = '境内注册';
            if (from == 'list') {
                $scope.timeline.sref = 'internal';
            } else {
                $scope.timeline.sref = 'internal_view({id: ' + source_id + '})';
            }
            break;
        case 'annual':
            $scope.timeline.title = '年检业务';
            if (from == 'list') {
                $scope.timeline.sref = 'annual';
            } else {
                $scope.timeline.sref = 'annual_view({id: ' + source_id + '})';
            }
            break;
        case 'audit':
            $scope.timeline.title = '审计业务';
            if (from == 'list') {
                $scope.timeline.sref = 'audit';
            } else {
                $scope.timeline.sref = 'audit_view({id: ' + source_id + '})';
            }
            break;
        case 'patent':
            $scope.timeline.title = '专利业务';
            if (from == 'list') {
                $scope.timeline.sref = 'patent';
            } else {
                $scope.timeline.sref = 'patent_view({id: ' + source_id + '})';
            }
            break;
        case 'trademark':
            $scope.timeline.title = '商标业务';
            if (from == 'list') {
                $scope.timeline.sref = 'trademark';
            } else {
                $scope.timeline.sref = 'trademark_view({id: ' + source_id + '})';
            }
            break;
        case 'history':
            $scope.timeline.title = '变更业务';
            $scope.timeline.sref = 'history_view({id: ' + source_id + '})';
            break;

    }

    $scope.data = {
        items: []
    };

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
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
