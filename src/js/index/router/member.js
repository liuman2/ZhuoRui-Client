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
        .state('member.detail', { // detail
            abstract: true,
            parent: 'detail',
            url: '/member',
            params: {
                scorm: null
            },
            template: require('view/member/detail/tmpl.html'),
            controller: require('view/member/detail/ctrl')
        })
        .state('member.detail.add', {
            url: '/new',
            stateName: '新建用户',
            views: views_member
        })
        .state('member.detail.edit', {
            url: '/edit/{id:.*}',
            stateName: '编辑用户',
            views: views_member
        })
        .state('member.detail.view', {
            url: '/view/{id:.*}',
            stateName: '查看用户',
            views: views_member
        })
};

module.exports = router;
