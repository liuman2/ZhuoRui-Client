var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
    $scope.reg_internal_id = $state.params.id || null;

    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    };

    $scope.edit = function(item) {

    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.$on('HISTORY_MODAL_DONE', function(e) {
        load_data();
    });

    function load_data() {
        $http({
            method: 'GET',
            url: '/RegInternal/History',
            params: {
                id: $scope.reg_internal_id
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
