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
            url: '/permission',
            template: require('view/permission/assign/tmpl.html'),
            controller: require('view/permission/assign/ctrl')
        })
};
