module.exports = function($scope, $http, $state, $stateParams) {
    var jTree = $("#org-tree");
    var zTree = null;

    $scope.group = '';

    function _setting() {
        return {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parent_id",
                    rootPid: 0
                }
            },
            view: {
                selectedMulti: false,
                showIcon: true
            },
            edit: {
                enable: false
            },
            callback: {
                onClick: onClick
            }
        };
    }

    function onClick(event, treeId, treeNode) {
        $scope.group = treeNode.group;
        if (!treeNode.group) {
            return;
        }

        getDataByGroup();
    }

    function getDataByGroup() {
        $http({
            method: 'GET',
            url: '/Dictionary/GetDictionaryByGroup',
            params: {
                group: $scope.group
            }
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    function load_tree() {
        $http({
            method: 'GET',
            url: '/Dictionary/Groups'
        }).success(function(data) {
            zTree = $.fn.zTree.init(jTree, _setting(), data);
            zTree.expandAll(true);
            if (!data.length) {
                return;
            }

            var nodeid = data[0].id;
            var treeNode = zTree.getNodeByParam("id", nodeid);
            if (treeNode) {
                zTree.selectNode(treeNode);
                $scope.group = treeNode.group;
                getDataByGroup();
            }
        });
    }

    $scope.add = function() {
        $state.go('.add', { group: $scope.group }, { location: false });
    }

    $scope.delete = function(id) {
        $.confirm({
            title: false,
            content: '您确认要删除吗？',
            confirmButton: '确定',
            cancelButton: '取消',
            confirm: function() {
                $http({
                    method: 'GET',
                    url: '/Dictionary/Delete',
                    params: {
                        id: id
                    }
                }).success(function(data) {
                    getDataByGroup();
                });
            }
        });
    }

    $scope.$on('DICT_MODAL_DONE', function(e) {
        getDataByGroup();
    });

    load_tree();
}
