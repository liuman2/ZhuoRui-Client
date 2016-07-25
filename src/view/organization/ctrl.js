module.exports = function($scope, $http, $state, $stateParams) {
    var jTree = $("#org-tree");
    var zTree = null;

    $scope.form = {};

    var jForm = $('.form-horizontal');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $scope.save = function() {

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
                showIcon: true,
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom
            },
            edit: {
                enable: true,
                removeTitle: '删除',
                showRenameBtn: false,
                showRemoveBtn: showRemoveBtn
            },
            callback: {
                // beforeClick: beforeClick,
                onClick: onClick,
                beforeRemove: beforeRemove,
                onRemove: onRemove
            }
        };
    }

    function showRemoveBtn(treeId, treeNode) {
        if (!treeNode.parent_id) {
            return false;
        }
        return true;
    }

    function beforeRemove(treeId, treeNode) {
        console.log(treeNode)
        $("#" + treeNode.tId + "_a").click();
        if (treeNode.isParent) {
            alert("存在下级部门, 无法删除!");
            return false;
        }
        if (!confirm('您确认要删除吗？')) {
            return false;
        }
        return true;
    }

    function onRemove(event, treeId, treeNode) {
        // $.ajax({
        //     url: _api + "/department/delete",
        //     type: 'get',
        //     async: false,
        //     data: {
        //         id: treeNode.id
        //     },
        //     success: function(data) {
        //         load_tree(selectId);
        //     },
        //     error: function(data) {
        //         alert(data.message);
        //         load_tree(treeNode.id);
        //     }
        // });

        $http({
            method: 'GET',
            url: '/Organization/List'
        }).success(function(data) {
            zTree = $.fn.zTree.init(jTree, _setting(), data);
            zTree.expandAll(true);
        })
    }

    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) {
            return;
        }
        var addStr = '<span class="button add" id="addBtn_' + treeNode.tId + '" title="添加子节点" onfocus="this.blur();"></span>';
        sObj.after(addStr);
        var btn = $('#addBtn_' + treeNode.tId);
        var newCount = 1;
        if (btn) {
            btn.bind('click', function() {
                var newNode = {
                    id: (100 + 1),
                    parent_id: treeNode.id,
                    name: '新节点' + (newCount++)
                }

                _addNodes(treeNode, newNode);
                return false;
            })
        };
    }

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    }

    function _addNodes(parentNode, newNodes) {
        // $.ajax({
        //     url: _api + "/department/save",
        //     type: 'post',
        //     async: false,
        //     data: {
        //         parent_id: parentNode.id,
        //         index: index,
        //         name: newNodes.name
        //     },
        //     success: function(data) {
        //         load_tree(data.id);
        //     }
        // });
        $http({
            method: 'POST',
            data: {
                parent_id: parentNode.id,
                name: newNodes.name
            },
            url: '/Organization/Add'
        }).success(function(data) {
            // zTree.addNodes(treeNode, newNode);
        })

    }

    function bindEditForm(treeNode) {
        console.log(treeNode);
        $scope.form = {
            id: treeNode.id,
            parent_id: treeNode.parent_id,
            name: treeNode.name,
            description: treeNode.description
        }
        $scope.$apply();
    }

    function onClick(event, treeId, treeNode) {
        bindEditForm(treeNode);
    }

    function load_tree(nodeid) {
        $http({
            method: 'GET',
            url: '/Organization/List'
        }).success(function(data) {
            zTree = $.fn.zTree.init(jTree, _setting(), data);
            zTree.expandAll(true);
            if (!data.length) {
                return;
            }

            nodeid = nodeid || data[0].id;
            var treeNode = zTree.getNodeByParam("id", nodeid);
            if (treeNode) {
                zTree.selectNode(treeNode);
                // $("#" + treeNode.tId + "_a").click();
                bindEditForm(treeNode);
            }
        })
    }

    load_tree();
}
