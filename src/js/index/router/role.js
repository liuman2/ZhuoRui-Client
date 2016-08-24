module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('role', {
            url: '/role',
            template: require('view/permission/role/tmpl.html'),
            controller: require('view/permission/role/ctrl')
        })
        .state('role.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/permission/role/modal.html'),
                    controller: require('view/permission/role/modal')
                }
            }
        })
        .state('role.edit', {
            url: '/edit/{id:.*}',
            views: {
                'add': {
                    template: require('view/permission/role/modal.html'),
                    controller: require('view/permission/role/modal')
                }
            }
        })
        .state('role_assign', {
            url: '/role/assign',
            template: require('view/permission/assign/tmpl.html'),
            controller: require('view/permission/assign/ctrl')
        })
        .state('role_user', {
            url: '/role/member',
            template: require('view/permission/member/tmpl.html'),
            controller: require('view/permission/member/ctrl')
        })
        .state('role_user.add', {
            url: '/new/{role_id:.*}',
            views: {
                'add': {
                    template: require('view/common/member/modal.html'),
                    controller: require('view/common/member/modal')
                }
            }
        })
};
