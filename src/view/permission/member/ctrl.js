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
        // getRoleMember(treeNode.id);
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
                // getRoleMenuTree(nodeid);
            }
        });
    }


    load_tree();
}
