var dateHelper = require('js/utils/dateHelper');
var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $http, $state, $stateParams) {

    $scope.customer_id = $state.params.customer_id;
    $scope.module = {
        id: $state.params.module_id,
        source_id: $state.params.source_id,
        name: '',
        code: $state.params.code
    }

    var source = '';
    var fields = [];
    $scope.fields = [];
    $scope.showChanges = false;

    switch ($scope.module.id) {
        case 'abroad':
            source = 'reg_abroad';
            $scope.module.name = '境外注册';
            fields = [{
                key: 'name_cn',
                value: '公司中文名称',
                map: false
            }, {
                key: 'name_en',
                value: '公司英文名称',
                map: false
            }, {
                key: 'address',
                value: '公司注册地址',
                map: false
            }, {
                key: 'reg_no',
                value: '公司注册编号',
                map: false
            }, {
                key: 'director',
                value: '公司董事',
                map: false
            }, {
                key: 'others',
                value: '其他变更',
                map: false
            }];
            break;
        case 'internal':
            source = 'reg_internal';
            $scope.module.name = '境内注册';

            fields = [{
                key: 'name_cn',
                value: '公司中文名称',
                map: false
            }, {
                key: 'reg_no',
                value: '公司注册编号',
                map: false
            }, {
                key: 'address',
                value: '公司注册地址',
                map: false
            }, {
                key: 'legal',
                value: '公司法人',
                map: false
            }, {
                key: 'director',
                value: '公司监事',
                map: false
            }, {
                key: 'others',
                value: '其他变更',
                map: false
            }];
            break;
        case 'trademark':
            source = 'trademark';
            $scope.module.name = '商标注册';

            fields = [{
                key: 'applicant',
                value: '申请人',
                map: false
            }, {
                key: 'address',
                value: '申请人地址',
                map: false
            }, {
                key: 'trademark_type',
                value: '商标类别',
                map: false
            }, {
                key: 'region',
                value: '商标注册地区',
                map: false
            }, {
                key: 'reg_mode',
                value: '注册方式',
                map: false
            }, {
                key: 'others',
                value: '其他变更',
                map: false
            }];
            break;
        case 'patent':
            source = 'patent';
            $scope.module.name = '专利注册';

            fields = [{
                key: 'applicant',
                value: '申请人',
                map: false
            }, {
                key: 'address',
                value: '申请人地址',
                map: false
            }, {
                key: 'card_no',
                value: '申请人证件号码',
                map: false
            }, {
                key: 'designer',
                value: '专利设计人',
                map: false
            }, {
                key: 'patent_type',
                value: '专利类型',
                map: false
            }, {
                key: 'patent_purpose',
                value: '专利用途',
                map: false
            }, {
                key: 'reg_mode',
                value: '注册方式',
                map: false
            }, {
                key: 'others',
                value: '其他变更',
                map: false
            }];
            break;
    }

    angular.copy(fields, $scope.fields);

    $scope.search = {
        index: 1,
        size: 20,
        source_id: $state.params.source_id,
        source: source,
        status: ''
    };

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

    $scope.showChange = function() {
        $scope.showChanges = !$scope.showChanges;
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    };

    $scope.edit = function(item) {
        if (item.status == 4) {
            $.alert({
                title: false,
                content: '订单已完成不能修改',
                confirmButton: '确定'
            });
            return;
        }

        if (item.status > 0) {
            $.alert({
                title: false,
                content: '已提交审核不能修改',
                confirmButton: '确定'
            });
            return;
        }

        $state.go("history_edit", {module_id: $scope.module.id, code:$scope.module.code, source_id: $scope.module.source_id, id: item.id});
    }

    $scope.delete = function(item) {
        if (item.status == 4) {
            $.alert({
                title: false,
                content: '订单已完成不能删除',
                confirmButton: '确定'
            });

            return;
        }

        if (item.status > 0) {
            $.alert({
                title: false,
                content: '已提交审核不能删除',
                confirmButton: '确定'
            });
            return;
        }

        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/History/Delete',
                    params: {
                        id: item.id
                    }
                }).success(function(data) {
                    load_data();
                });
            }
        });
    }

    $scope.getOrderStatus = function(status) {
        switch (status) {
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

    $scope.getReviewStatus = function(status, review_status) {
        switch (review_status) {
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

    function load_data() {
        $http({
            method: 'GET',
            url: '/History/List',
            params: $scope.search
        }).success(function(data) {
            data.items = data.items || [];

            for (var i = 0, max = data.items.length; i < max; i++) {
                var item = data.items[i];
                item.fields = {};
                if (item.value.length > 0) {
                    item.fields = JSON.parse(item.value);
                }
            }
            $scope.data = data;
        });
    }

    load_data();
}
