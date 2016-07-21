var views_bundle = {
    'info': {
        template: require('view/bundle/info/tmpl.html'),
        controller: require('view/bundle/info/ctrl')
    },
    'content': {
        template: require('view/bundle/content/tmpl.html'),
        controller: require('view/bundle/content/ctrl')
    },
    'price': {
        template: require('view/bundle/price/tmpl.html')
    }
};

module.exports = function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('bundle', {
      parent: 'list',
      url: '/bundle',
      stateName: '系列课程',
      template: require('view/bundle/list/tmpl.html'),
      controller: require('view/bundle/list/ctrl')
    })
    .state('bundle.detail', { // detail
        abstract: true,
        parent: 'detail',
        url: '/bundle',
        template: require('view/bundle/detail/tmpl.html'),
        controller: require('view/bundle/detail/ctrl')
    })
    .state('bundle.detail.add', {
        url: '/new',
        stateName: '新建系列课程',
        views: views_bundle
    })
    .state('bundle.detail.add.range', {
        url: '/range',
        views: {
            'range': {
                template: require('view/bundle/info/range.html'),
                controller: require('view/bundle/info/range')
            }
        }
    })
    .state('bundle.detail.add.courses', {
        url: '/courses',
        views: {
            'courseware': {
                template: require('view/bundle/content/modal.html'),
                controller: require('view/bundle/content/modal')
            }
        }
    })
    .state('bundle.detail.add.imgupload', {
        url: '/imgupload',
        params: {
            options: {
                width: 220,
                height: 124
            }
        },
        views: {
            'imgupload': {
                template: require('view/common/imgUpload/tmpl.html'),
                controller: require('view/common/imgUpload/ctrl')
            }
        }
    })
    .state('bundle.detail.edit', {
        url: '/edit/{id:.*}',
        stateName: '编辑系列课程',
        views: views_bundle
    })
    .state('bundle.detail.edit.range', {
        url: '/range',
        views: {
            'range': {
                template: require('view/bundle/info/range.html'),
                controller: require('view/bundle/info/range')
            }
        }
    })
    .state('bundle.detail.edit.imgupload', {
        url: '/imgupload',
        params: {
            options: {
                width: 220,
                height: 124
            }
        },
        views: {
            'imgupload': {
                template: require('view/common/imgUpload/tmpl.html'),
                controller: require('view/common/imgUpload/ctrl')
            }
        }
    })
    .state('bundle.detail.edit.courses', {
        url: '/courses',
        views: {
            'courseware': {
                template: require('view/bundle/content/modal.html'),
                controller: require('view/bundle/content/modal')
            }
        }
    })
    .state('bundle.detail.view', {
        url: '/view/{id:.*}',
        stateName: '查看系列课程',
        views: views_bundle
    })
    .state('bundle.detail.onShelves', {
        parent: 'detail',
        url: '/bundle/onShelves/{id:[0-9]+}',
        stateName: '系列课程上架',
        template: require('view/course/onShelves/tmpl.html'),
        controller: require('view/course/onShelves/ctrl')
    })
    .state('bundle.detail.onShelves.success', {
        parent: 'detail',
        url: '/bundle/success',
        template: require('view/bundle/onShelves/success.html')
    })

};
