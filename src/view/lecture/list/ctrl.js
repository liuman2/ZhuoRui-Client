var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function ($scope, $http, $state, $stateParams) {
    var dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        // maxDate: new Date(),
        format: 'Y-m-d',
        scrollInput: false,
        onChangeDateTime: function (current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.search = {
        index: 1,
        size: 20,
        title: '',
        form: '',
        start_time: '',
        end_time: ''
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

    $scope.query = function () {
        load_data();
    };

    $scope.delete = function (item) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function () {
                $http({
                    method: 'GET',
                    url: '/Lecture/Delete',
                    params: {
                        id: item.id
                    }
                }).success(function (data) {
                    load_data();
                });
            }
        });
    }

    $scope.edit = function (item) {
        $state.go("lecture_edit", { id: item.id });
    }

    $scope.format = function (dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.go = function (index) {
        $scope.search.index = index;
        load_data();
    };

    function load_data() {
        $scope.search.start_time = $('#start_time').val();
        $scope.search.end_time = moment($('#start_time').val()).format('YYYY-MM-DD 23:59:59');

        $http({
            method: 'GET',
            url: '/Lecture/Search',
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

    load_data();
}
