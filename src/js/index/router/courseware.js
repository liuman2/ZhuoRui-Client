var router = function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('courseware', { // list
            parent: 'list',
            url: '/courseware',
            stateName: '我的课件',
            template: require('view/courseware/list/tmpl.html'),
            controller: require('view/courseware/list/ctrl')
        })
        .state('courseware.upload', {
            parent: 'detail',
            url: '/courseware/upload',
            stateName: '上传课件',
            template: require('view/courseware/upload/tmpl.html'),
            controller: require('view/courseware/upload/ctrl')
        })
};

module.exports = router;
