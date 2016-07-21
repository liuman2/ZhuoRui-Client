module.exports = function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/signin');

    $stateProvider
        // .state('root', {
        //     abstract: true,
        //     url: '',
        //     template: '<div ui-view></div>'
        // })
        .state('signin', {
            url: '/signin',
            template: require('view/signin/tmpl.html'),
            controller: require('view/signin/ctrl')
        })
        .state('signup', {
            url: '/signup',
            template: require('view/signup/tmpl.html'),
            controller: require('view/signup/ctrl')
        })
        .state('recovery', {
            url: '/recovery',
            template: require('view/recovery/tmpl.html'),
            controller: require('view/recovery/ctrl')
        })
        .state('profile', {
            url: '/profile/{id:.*}',
            template: require('view/profile/tmpl.html'),
            controller: require('view/profile/ctrl')
        })
        .state('profile.imgupload', {
            url: '/imgupload',
            params: {
                options: {
                    width: 100,
                    height: 100
                }
            },
            views: {
                'imgupload': {
                    template: require('view/common/imgUpload/tmpl.html'),
                    controller: require('view/common/imgUpload/ctrl')
                }
            }
        });
};
