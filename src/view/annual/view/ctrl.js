var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    if (!!id) {
        $scope.id = id;
        actionView();
    }
    $scope.data = {
        status: 0,
        review_status: -1
    }
    $scope.deleteIncome = function(item) {
        if ($scope.data.status > 0) {
            alert('已提交审核不能删除')
            return;
        }

        if ($scope.data.status == 4) {
            alert('订单已完成不能删除')
            return;
        }

        if ($scope.data.review_status == 1) {
            var msg = $scope.data.status == 2 ? '已通过财务审核不能删除' : '已通过提交人审核不能删除';
            alert(msg);
            return;
        }

        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Income/Delete',
            params: {
                id: item.id
            }
        }).success(function(data) {
            actionView();
        });
    }

    $scope.incomes = {
        items: [],
        total: 0,
        balance: 0
    };

    $scope.edit = function() {
        $state.go("annual_edit", {
            id: id
        });
    }

     $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    $scope.cancel = function() {
        $state.go('annual');
    }

    $scope.submitAudit = function() {
        if (!confirm('您确认要提交审核？提交后不可再编辑')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Annual/Submit',
            params: {
                id: $scope.data.id
            }
        }).success(function(data) {
            actionView();
        });
    }

    $scope.passAudit = function() {
        if (!confirm('您确认通过审核？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Annual/PassAudit',
            params: {
                id: $scope.data.id
            }
        }).success(function(data) {
            actionView();
        });
    }

    $scope.refuseAudit = function() {
        $state.go(".audit", {module_name: 'Annual'}, { location:false });
    }

    $scope.done = function() {
        $state.go(".done", {module_name: 'Annual'}, { location:false });
    }

    $scope.getOrderStatus = function() {
        switch($scope.data.status) {
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

    $scope.getTitle = function(item) {
        if (item.review_status == 0) {
            return item.finance_review_moment || item.submit_review_moment;
        }
        return '';
    }

    $scope.getReviewStatus = function() {
        switch($scope.data.review_status) {
            case -1:
                return '未审核';
            case 0:
                return '驳回';
            case 1:
                return '审核通过';
        }
    }

    $scope.getTypeName = function(type) {
        switch(type) {
            case 'reg_abroad':
                return '境外注册';
            case 'reg_internal':
                return '境内注册';
            case 'trademark':
                return '商标注册';
            case 'patent':
                return '专利注册';
        }
    }

    $scope.progress = function(t) {
        // if ($scope.data.status == 4) {
        //     alert('订单已完成，无需再更新进度');
        //     return;
        // }

        if ($scope.data.status < 3) {
            $.alert({
                title: false,
                content: t == 'p' ? '提交人还未提交该订单，无法更新进度' : '提交人还未提交该订单，无法完善注册资料',
                confirmButton: '确定'
            });
            return;
        }

        if ($scope.data.review_status != 1) {
            $.alert({
                title: false,
                content: t == 'p' ? '订单未通过审核，无法更新进度' : '订单未通过审核，无法完善注册资料',
                confirmButton: '确定'
            });
            return;
        }

        $state.go(".progress", {id: $scope.data.id, module_name: 'Annual', type: t}, {location: false});
    }

    $scope.$on('PROGRESS_MODAL_DONE', function(e) {
        actionView();
    });

    $scope.$on('INCOME_MODAL_DONE', function(e) {
        actionView();
    });

    $scope.$on('REFUSE_MODAL_DONE', function(e) {
        actionView();
    });

    $scope.$on('FINISH_MODAL_DONE', function(e) {
        actionView();
    });

    function actionView() {
        $http({
            method: 'GET',
            url: '/Annual/GetView',
            params: {
                id: id
            }
        }).success(function(data) {
            console.log(data);
            $scope.data = data.order;
            $scope.incomes = data.incomes;
        });
    }
};
