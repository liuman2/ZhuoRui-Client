var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {
    var dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        // maxDate: new Date(),
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
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

    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    $scope.query = function() {
        load_data();
    };

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    };

    function load_data() {
        $scope.search.start_time = $('#start_time').val();
        $scope.search.end_time = $('#end_time').val();

        $http({
            method: 'GET',
            url: '/Letter/Search',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
