var dateHelper = require('js/utils/dateHelper');

module.exports = function($scope, $http, $state, $stateParams) {

    $scope.search = {
        index: 1,
        size: 10,
        customer_id: '',
        status: '',
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

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    };

    $scope.delete = function(item) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        if (item.status == 4) {
            alert('订单已完成不能删除');
            return;
        }

        if (item.status > 0) {
            alert('已提交审核不能删除');
            return;
        }

        $http({
            method: 'GET',
            url: '/RegAbroad/Delete',
            params: {
                id: item.id
            }
        }).success(function(data) {
            load_data();
        });
    }

    $scope.edit = function(item) {
        if (item.status == 4) {
            alert('订单已完成不能修改');
            return;
        }

        if (item.status > 0) {
            alert('已提交审核不能修改');
            return;
        }

        $state.go("abroad_edit", {id: item.id});
    }

    $scope.getOrderStatus = function(status) {
        switch(status) {
            case 0:
                return '未提交';
            case 1:
                return '已提交';
            case 2:
                return '财务已审核';
            case 3:
                return '提交人已审核';
            case 4:
                return '完成';
        }
    }
    $scope.getReviewStatus= function(status, review_status) {
        switch(review_status) {
            case -1:
                return '未审核';
            case 0:
                if (status == 2) {
                    return '财务审核未通过';
                } else　{
                    return '提交审核未通过';
                }
            case 1:
                return '审核已通过';
        }
    }

    function load_data() {
        $http({
            method: 'GET',
            url: '/RegAbroad/Search',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}
