var views_member = {
    'info': {
        template: require('view/member/info/tmpl.html'),
        controller: require('view/member/info/ctrl')
    }
};

var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('member', { // list
            parent: 'list',
            url: '/member',
            stateName: '用户列表',
            template: require('view/member/list/tmpl.html'),
            controller: require('view/member/list/ctrl')
        })
        .state('member_add', {
            url: '/member/new',
            stateName: '新建用户',
            template: require('view/member/info/tmpl.html'),
            controller: require('view/member/info/ctrl')
        })
        .state('member_edit', {
            url: '/member/edit/{id:.*}',
            stateName: '编辑用户',
            template: require('view/member/info/tmpl.html'),
            controller: require('view/member/info/ctrl')
        })
        .state('member_view', {
            url: '/member/view/{id:.*}',
            stateName: '查看用户',
            template: require('view/member/view/tmpl.html'),
            controller: require('view/member/view/ctrl')
        })
};

module.exports = router;
