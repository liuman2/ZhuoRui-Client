module.exports = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('user', {
            url: '/user',
            template: require('view/user/nav.html')
        })
         .state('user.profile', {
             url: '/profile',
             template: require('view/user/profile/tmpl.html'),
             controller: require('view/user/profile/ctrl')
         })
        .state('user.message', {
            url: '/message',
            template: require('view/user/message/tmpl.html'),
            controller: require('view/user/message/ctrl')
        })
        .state('user.info', {
            url: '/info',
            template: require('view/user/info/tmpl.html'),
            controller: require('view/user/info/ctrl')
        })
        .state('user.info.imgupload', {
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
        })
        .state('user.password', {
            url: '/password',
            template: require('view/user/password/tmpl.html'),
            controller: require('view/user/password/ctrl')
        });

};
