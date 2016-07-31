module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('dictionary', {
            url: '/dictionary',
            template: require('view/dictionary/tmpl.html'),
            controller: require('view/dictionary/ctrl')
        })
        .state('dictionary.add', {
            url: '/new/{group:.*}',
            views: {
                'add': {
                    template: require('view/dictionary/modal.html'),
                    controller: require('view/dictionary/modal')
                }
            }
        })
        .state('dictionary.edit', {
            url: '/edit/{group:.*}/{id:.*}',
            views: {
                'add': {
                    template: require('view/dictionary/modal.html'),
                    controller: require('view/dictionary/modal')
                }
            }
        })
};
