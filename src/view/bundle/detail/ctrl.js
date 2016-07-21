module.exports = function($scope, $state, $element, $http, $location, $anchorScroll) {

    $scope.data = {
        id: null,
        create_way: '',
        name: '', //课程名称
        cover_id: '', //封面id
        cover_url: '', //封面url

        attribute: {
            industry_id: null,
            industry_name: '',
            post_id: null,
            post_name: '',
            experience_id: null,
            experience_name: '',
            tags: [] //标签
        },
        info: '', //课程简介
        items: [],
        price: {
            type: '', //free-免费, charge-收费
            unit_price: 20, //零售价格
            is_buyout: true, //启用买断
            buyout_price: 2000, //买断价格
            is_group_purchase: true, //启用团购
            group_purchase: [{
                gte: 1,
                lte: 19,
                price: 20
            }]
        }
    };

    $scope.itemsIsInValid = false;
    $scope.status_desc = '未提交';
    // set action
    $scope.action = null;
    var id = $state.params.id || null;
    switch ($state.current.name) {
        case 'bundle.detail.add':
            $scope.action = 'add';
            $scope.editable = true;
            break;
        case 'bundle.detail.edit':
            $scope.action = 'update';
            $scope.editable = true;
            break;
        case 'bundle.detail.view':
            $scope.action = 'view';
            $scope.editable = false;
            break;
        default:
            break;
    }
    if (id) actionView();

    // view
    $scope.views = [];
    $scope.inView = {};
    $scope.outView = {};
    $scope.currentView = null;

    $scope.trackView = function(distance, element, edge) {
        var id = element.attr('id');
        if ($scope.views.indexOf(id) == -1) {
            $scope.views.push(id);
            // $scope.views.sort();
        }
        if (distance >= 0) {
            $scope.inView[id] = false;
            $scope.outView[id] = edge;
            // element.removeClass('in-view');
        } else {
            $scope.inView[id] = true;
            $scope.outView[id] = undefined;
            // element.addClass('in-view');

            if ($scope.currentView !== id) {
                var scorllIndex = $scope.views.indexOf(id);
                var nowIndex = $scope.views.indexOf($scope.currentView);

                if (nowIndex === -1 || !$scope.inView[$scope.currentView] || nowIndex > scorllIndex) {
                    $scope.currentView = id;
                }
            }
        }

        $scope.$apply();
    };

    // scorll to
    $scope.goto = function(elem) {
        $location.hash(`${elem}`);
        $anchorScroll();
    };

    $scope.detailVisible = true;
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            var stateUrl = ['/upload', '/scorm', '/onShelves/{detailId:[0-9]+}', '/success']
            if (stateUrl.indexOf(toState.url) != -1) {
                $scope.detailVisible = false;
            } else {
                $scope.detailVisible = true;
            }
        });

    // api call
    function actionAdd() {
        $http({
            method: 'POST',
            url: '/series',
            data: $scope.data
        }).then(function() {
            $state.go('bundle');
        }, function(rep) {
            alert(rep.data.message || '保存失败');
        });
    }

    function actionUpdate() {
        $http({
            method: 'PUT',
            url: `/series`,
            data: $scope.data
        }).then(function() {
            $state.go('bundle');
        }, function(rep) {
            alert(rep.data.message || '保存失败');
        });
    }

    function actionView() {
        $http({
            method: 'GET',
            url: `/series/${id}`
        }).success(function(data) {
            if (data) {
                $scope.data = $.extend(true, $scope.data, data);
                switch ($scope.data.status) {
                    case 'canceled':
                        $scope.status_desc = '已撤销';
                        break;
                    case 'offshelves':
                        $scope.status_desc = '已下架';
                        break;
                    case 'onshelves':
                        $scope.status_desc = '已上架';
                        break;
                    case 'auditing':
                        $scope.status_desc = '审核中';
                        break;
                    case 'uncommitted':
                        $scope.status_desc = '未提交';
                        break;
                }
            }
        });
    }

    function isItemsValid() {
        $scope.data.items = $scope.data.items || [];
        $scope.itemsIsInValid = !$scope.data.items.length;

        if (!$scope.data.items.length) {
            return false;
        }

        return true;
    }

    $scope.onSave = function() {
        var jForm = $('.detail-view-body');
        jForm.isValid(function(v) {
            if (v) {
                if (!isItemsValid()) {
                    $scope.goto('content');
                    return;
                }

                switch ($scope.action) {
                    case 'add':
                        actionAdd();
                        break;
                    case 'update':
                        actionUpdate();
                        break;
                }
            }
        });
    };

    // data temp
    //$scope.uploadFileContent = null;
    $scope.selectedCourses = [];
};
