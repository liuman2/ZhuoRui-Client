module.exports = function($scope, $http, $state, $stateParams) {
    var roleTree = null;

    $scope.select = function() {
        var nodes = roleTree.getSelectedNodes();
        if (!nodes.length) {
            return;
        }
        var roleId = nodes[0].id;

        $state.go('.add', { role_id: roleId }, { location: false });
    }

    $scope.delete = function(item) {
        if (!confirm('您确认要删除吗？')) {
            return false;
        }

        var nodes = roleTree.getSelectedNodes();
        if (!nodes.length) {
            return;
        }
        var roleId = nodes[0].id;

        $http({
            method: 'GET',
            url: '/Role/DeleteRoleMember',
            params: {
                roleId: roleId,
                userId: item.id
            }
        }).success(function(data) {
            getRoleMember(roleId);
        });
    }

    $scope.$on('ROLE_MEMBER_MODAL_DONE', function(e) {
        var nodes = roleTree.getSelectedNodes();
        var roleId = null;
        if (nodes.length) {
            roleId = nodes[0].id;
        }

        load_tree(roleId);
    });

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

    function onCheck(e, treeId, treeNode) {

    }

    function onClick(event, treeId, treeNode) {
        getRoleMember(treeNode.id);
    }

    function load_tree(nodeid) {
        $http({
            method: 'GET',
            url: '/Role/Tree'
        }).success(function(data) {
            roleTree = $.fn.zTree.init($("#role-tree"), _setting(), data);
            roleTree.expandAll(true);
            if (!data.length) {
                return;
            }

            nodeid = nodeid || data[0].id;
            var treeNode = roleTree.getNodeByParam("id", nodeid);
            if (treeNode) {
                roleTree.selectNode(treeNode);
                getRoleMember(nodeid);
            }
        });
    }

    function getRoleMember(roleId) {
        var nodes = roleTree.getSelectedNodes();
        if (!nodes.length) {
            return;
        }
        var roleId = nodes[0].id;

         $http({
            method: 'GET',
            url: '/Role/GetMemberByRoleId',
            params: {
                roleId: roleId
            }
        }).success(function(data) {
            $scope.data = data;
        });
    }

    load_tree();
}
