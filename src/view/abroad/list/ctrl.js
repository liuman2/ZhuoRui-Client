var dateHelper = require('js/utils/dateHelper');

module.exports = function($scope, $http, $state, $stateParams) {

    $scope.data = {
        "items": [],
        "page": {
            "current_index": 1,
            "current_size": 10,
            "total_page": 18,
            "total_size": 176
        }
    };

}
