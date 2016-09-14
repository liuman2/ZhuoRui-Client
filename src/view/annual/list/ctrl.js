var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {

    $scope.search = {
        index: 1,
        size: 10,
        customer_id: '',
        status: '',
        start_time: '',
        end_time: ''
    }

    var dInput = $('.date-input');

    $.datetimepicker.setLocale('ch');
    dInput.datetimepicker({
        timepicker: false,
        maxDate: new Date(),
        format: 'Y-m-d',
        onChangeDateTime: function(current_time, $input) {
            console.log(current_time)
        }
    });

    $scope.getTitle = function(item) {
        if (item.review_status == 0) {
            return item.finance_review_moment || item.submit_review_moment;
        }
        return '';
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
        if (item.status == 4) {
            alert('订单已完成不能删除');
            return;
        }

        if (item.status > 0) {
            alert('已提交审核不能删除');
            return;
        }

        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Annual/Delete',
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

        $state.go("annual_edit", {id: item.id});
    }

    $scope.progress = function(item) {
        if (item.status == 4) {
            alert('订单已完成，无需再更新进度');
            return;
        }

        if (item.status < 3) {
            alert('提交人还未提交该订单，无法更新进度');
            return;
        }

        if (item.review_status != 1) {
            alert('订单未通过审核，无法更新进度');
            return;
        }

        $state.go(".progress", {id: item.id, module_name: 'Annual'}, {location: false});
    }

    $scope.$on('PROGRESS_MODAL_DONE', function(e) {
        load_data();
    });

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
                return '驳回';
            case 1:
                return '审核通过';
        }
    }

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.getTypeName = function(t) {
        switch(t) {
            case 'reg_abroad':
                return "境外注册";
            case 'reg_internal':
                return "境内注册";
            case 'audit':
                return "年审业务";
            case 'trademark':
                return "商标注册";
            case 'patent':
                return "专利注册";
        }
    }

    function load_data() {
        $scope.search.start_time = $('#start_time').val();
        $scope.search.end_time = $('#end_time').val();

        $http({
            method: 'GET',
            url: '/Annual/Search',
            params: $scope.search
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_data();
}