module.exports = function($scope, $http, $state, $stateParams) {
    var jTree = $("#org-tree");
    var zTree = null;
    

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
        
    }

    function load_tree() {
        var data=[{
            id: 1,
            parent_id: 0,
            type: 'industry',
            name: '行业类别'
        },{
            id: 2,
            parent_id: 0,
            type: 'customer_source',
            name: '客户来源'
        },{
            id: 3,
            parent_id: 0,
            type: 'customer_source',
            name: '客户来源'
        },{
            id: 4,
            parent_id: 0,
            type: 'trade_way',
            name: '贸易方式'
        },{
            id: 5,
            parent_id: 0,
            type: 'register_way',
            name: '注册方式'
        },{
            id: 6,
            parent_id: 0,
            type: 'patent_type',
            name: '专利类型'
        },{
            id: 7,
            parent_id: 0,
            type: 'patent_way',
            name: '专利用途'
        }];

        zTree = $.fn.zTree.init(jTree, _setting(), data);
            zTree.expandAll(true);
            if (!data.length) {
                return;
            }

            var treeNode = zTree.getNodeByParam("id", 1);
            if (treeNode) {
                zTree.selectNode(treeNode);
                
            }
    }

    load_tree();
}
