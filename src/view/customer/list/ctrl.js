var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {

    $scope.search = {
        userId: $scope.userInfo.id,
        index: 1,
        size: 20,
        name: ""
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

    $scope.transferBack = function(id) {
        $.confirm({
            title: false,
            content: '您确认要转为意向客户吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Customer/TransferBack',
                    params: {
                        id: id
                    }
                }).success(function(data) {
                    load_data();
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

    $scope.export = function(eve) {
        var url = "/Customer/Export",
            iframe = document.createElement("iframe");

        iframe.src = url;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        eve.stopPropagation();
    }

    $scope.query = function() {
        load_data();
    };

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    };

    function load_data() {
        $http({
            method: 'GET',
            url: '/Customer/Search',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
