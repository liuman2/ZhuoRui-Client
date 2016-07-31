module.exports = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('dictionary', {
            url: '/dictionary',
            template: require('view/dictionary/tmpl.html'),
            controller: require('view/dictionary/ctrl')
        })
        // .state('dictionary.add', {
        //     url: '/new',
        //     views: {
        //         'add': {
        //             template: require('view/dictionary/modal.html'),
        //             controller: require('view/dictionary/modal')
        //         }
        //     }
        // })
        // .state('dictionary.edit', {
        //     url: '/edit/{id:.*}',
        //     views: {
        //         'add': {
        //             template: require('view/dictionary/modal.html'),
        //             controller: require('view/dictionary/modal')
        //         }
        //     }
        // })
};
