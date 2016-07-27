module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('position', {
            url: '/position',
            template: require('view/position/tmpl.html'),
            controller: require('view/position/ctrl')
        })
        .state('position.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/position/modal.html'),
                    controller: require('view/position/modal')
                }
            }
        })
        .state('position.edit', {
            url: '/edit/{id:.*}',
            views: {
                'add': {
                    template: require('view/position/modal.html'),
                    controller: require('view/position/modal')
                }
            }
        })
};
