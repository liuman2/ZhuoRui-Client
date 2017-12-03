var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $cookieStore, $stateParams) {

    $scope.search = {
        userId: $scope.userInfo.id,
        index: 1,
        size: 20,
        name: ""
    }

    var searchStorage = sessionStorage.getItem('SEARCH_STORAGE');
    if (searchStorage) {
        var preSearch = JSON.parse(searchStorage);
        if (preSearch.key == $state.current.name) {
            $scope.search = preSearch.search;
        }
    }

    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    if ($scope.opers == undefined) {
        $scope.opers = $cookieStore.get('USER_OPERS');
    }

    $scope.format = function (dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.query = function () {
        load_data();
    };

    $scope.go = function (index) {
        $scope.search.index = index;
        load_data();
    };

    $scope.add = function() {
        $state.go('.add', null, { location: false });
    }

    function load_data() {
        $http({
            method: 'GET',
            url: '/Supplier/Search',
            params: $scope.search
        }).success(function (data) {
            $scope.data = data;

            var searchSession = {
                key: $state.current.name,
                search: angular.copy($scope.search)
            }

            sessionStorage.setItem('SEARCH_STORAGE', JSON.stringify(searchSession));
        });
    }

    $scope.$on('SUP_MODAL_DONE', function(e) {
        load_data();
    });

    load_data();
}
