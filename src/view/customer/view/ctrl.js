var moment = require('moment');
moment.locale('zh-cn');

module.exports = function($scope, $state, $http, $q, $timeout) {

    var id = $state.params.id || null;

    $scope.attachments = [];

    if (!!id) {
        $scope.id = id;
        actionView();
    }

    $scope.delete = function(item) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        $http({
            method: 'GET',
            url: '/Customer/DeleteBank',
            params: {
                id: item.id
            }
        }).success(function(data) {
            actionView();
        });
    }

    $scope.edit = function() {
        // $state.go('customer_edit({id: ' + id + '})');
        $state.go("customer_edit", {id: id});
    }

    $scope.cancel = function() {
        $state.go('customer');
    }

    $scope.$on('BANK_MODAL_DONE', function(e) {
        actionView();
    });

    $scope.$on('ATTACHMENT_MODAL_DONE', function(e) {
        loadAttachments();
    });

    $scope.format = function(dt, str) {
        if (!dt) {
            return '';
        }
        return moment(dt).format(str);
    }

    function actionView() {
        $http({
            method: 'GET',
            url: '/Customer/Get',
            params: {
                id: id
            }
        }).success(function(data) {
            data.contacts = data.contacts || '';
            data.contactList = [];
            if (data.contacts != '') {
                data.contactList = JSON.parse(data.contacts)
            }
            $scope.data = data;
            getOrders();
            loadAttachments();
        });
    }

    function loadAttachments() {
        $http({
            method: 'GET',
            url: '/Attachment/Get',
            params: {
                source_id: id,
                source_name: 'customer'
            }
        }).success(function(data) {
            $scope.attachments = data || [];
        });
    }

    function getOrders() {
        $http({
            method: 'GET',
            url: '/Customer/GetBusinessByCustomerId',
            params: {
                customerId: id
            }
        }).success(function(data) {
            $scope.orders = data;
        });
    }
};
