var httpHelper = require('js/utils/httpHelper');
module.exports = function($scope, $state, $http, $timeout) {
    var id = $state.params.id || null

    $scope.data = {
        customer: {
            id: id,
            name: ''
        },
        items: []
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

    getTimeline();
};
