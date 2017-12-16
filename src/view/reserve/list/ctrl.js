var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams) {

    $scope.search = {
        userId: $scope.userInfo.id,
        index: 1,
        size: 20,
        name: ""
    }
    $scope.searchType  = "name";
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

    $scope.query = function () {
        load_data();
    };

    $scope.go = function (index) {
        $scope.search.index = index;
        load_data();
    };

    $scope.format = function (dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.typePlaceholder = '客户名称';
    $scope.searchTypeChange = function() {
        var searchType = {
            name: '客户名称',
            contact: '联系人姓名, 电话, QQ, 邮箱, 微信'
        }
        $scope.typePlaceholder = searchType[$scope.searchType];
    }

    $scope.delete = function (item) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function () {
                $http({
                    method: 'GET',
                    url: '/Reserve/Delete',
                    params: {
                        id: item.id
                    }
                }).success(function (data) {
                    load_data();
                });
            }
        });
    }

    $scope.transfer = function (item) {
        $.confirm({
            title: false,
            content: '您确认要转为正式客户吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function () {
                $http({
                    method: 'GET',
                    url: '/Reserve/Transfer',
                    params: {
                        id: item.id
                    }
                }).success(function (data) {
                    load_data();
                });
            }
        });
    }

    function load_data() {
        $scope.search.type = $scope.searchType;
        $http({
            method: 'GET',
            url: '/Reserve/Search',
            params: $scope.search
        }).success(function (data) {
            console.log(data)
            $scope.data = data;

            var searchSession = {
                key: $state.current.name,
                search: angular.copy($scope.search)
            }

            sessionStorage.setItem('SEARCH_STORAGE', JSON.stringify(searchSession));
        });
    }

    load_data();
}
