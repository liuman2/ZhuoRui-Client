var views_abroad = {
    'info': {
        template: require('view/lecture/info/tmpl.html'),
        controller: require('view/lecture/info/ctrl')
    }
};

var router = function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('lecture', {
            parent: 'list',
            url: '/lecture',
            template: require('view/lecture/list/tmpl.html'),
            controller: require('view/lecture/list/ctrl')
        })
        .state('lecture_add', {
            parent: 'list',
            url: '/lecture/add',
            template: require('view/lecture/info/tmpl.html'),
            controller: require('view/lecture/info/ctrl')
        })
        .state('lecture_edit', {
            url: '/lecture/edit/{id:.*}',
            template: require('view/lecture/info/tmpl.html'),
            controller: require('view/lecture/info/ctrl')
        })
        .state('lecture_view', {
            url: '/lecture/view/{id:.*}',
            template: require('view/lecture/view/tmpl.html'),
            controller: require('view/lecture/view/ctrl')
        })
        .state('lecture_view.customer_add', {
            url: '/new',
            views: {
                'modal': {
                    template: require('view/lecture/view/modal.html'),
                    controller: require('view/lecture/view/modal')
                }
            }
        })
};

module.exports = router;
