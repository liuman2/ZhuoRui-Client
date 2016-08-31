module.exports = function($scope, $http, $state, $stateParams) {
    var roleTree = null;
    var menuTree = null;
    var operTree = null;

    $scope.save = function() {
        var nodes = roleTree.getSelectedNodes();
        if (!nodes.length) {
            return;
        }

        var roleId = nodes[0].id;

        var menuIds = [];
        var menuNodes = menuTree.getCheckedNodes(true);

        var operIds = [];
        var operNodes = operTree.getCheckedNodes(true);

        if (menuNodes.length) {
            $.map(menuNodes, function(menu) {
                menuIds.push(menu.id);
            });
        }

        if (operNodes.length) {
            $.map(operNodes, function(oper) {
                operIds.push(oper.id);
            });
        }

        $http({
            method: 'POST',
            url: '/Role/SaveRoleMenu',
            data: {
                roleId: roleId,
                menuIds: menuIds,
                operIds: operIds
            }
        }).success(function() {
            load_tree(roleId);
        });
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

    function _menuSetting() {
        return {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parent_id",
                    rootPid: 0
                },
                key: {
                    checked: "check"
                }
            },
            view: {
                selectedMulti: true,
                showIcon: true
            },
            edit: {
                enable: false
            },
            callback: {
                onCheck: onCheck
            }
        };
    }

    function onCheck(e, treeId, treeNode) {

    }

    function onClick(event, treeId, treeNode) {
        getRoleMenuTree(treeNode.id);
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
                getRoleMenuTree(nodeid);
            }
        });
    }

    function getRoleMenuTree(roleId) {
        $http({
            method: 'GET',
            url: '/Role/GetMenuByRoleId',
            params: {
                roleId: roleId
            }
        }).success(function(data) {
            menuTree = $.fn.zTree.init($("#menu-tree"), _menuSetting(), data.menus);
            menuTree.expandAll(true);

            operTree = $.fn.zTree.init($("#oper-tree"), _menuSetting(), data.opers);
            operTree.expandAll(true);
        });
    }

    load_tree();
}
