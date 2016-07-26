module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('area', {
            url: '/area',
            template: require('view/area/tmpl.html'),
            controller: require('view/area/ctrl')
        })
        .state('area.add', {
            url: '/new',
            views: {
                'add': {
                    template: require('view/area/modal.html'),
                    controller: require('view/area/modal')
                }
            }
        })
        .state('area.edit', {
            url: '/edit/{id:.*}',
            views: {
                'add': {
                    template: require('view/area/modal.html'),
                    controller: require('view/area/modal')
                }
            }
        })
};
