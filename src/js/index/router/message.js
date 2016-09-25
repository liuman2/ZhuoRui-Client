var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('message', {
            parent: 'list',
            url: '/message',
            template: require('view/message/tmpl.html'),
            controller: require('view/message/ctrl')
        })
};

module.exports = router;
