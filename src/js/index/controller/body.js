module.exports = function ($scope, $rootScope, $http) {
    $scope.bodyClass = '';

    $scope.userInfo = {};

    $scope.menus = [{
        route: '',
        name: '客户管理',
        icon: 'fa fa-users',
        children: [{
            route: 'reserve',
            name: '预备客户',
            icon: 'fa fa-user-md'
        },{
            route: 'customer',
            name: '正式客户',
            icon: 'fa fa-user-secret'
        },{
            route: 'import',
            name: '导入正式客户',
            icon: 'fa fa-cloud-upload'
        }]
    }, {
        route: '',
        name: '业务管理',
        icon: 'fa fa-cart-arrow-down',
        children:[{
            route: 'abroad',
            name: '境外注册',
            icon: 'fa fa-globe'
        },{
            route: 'reserve',
            name: '境内注册',
            icon: 'fa fa-street-view'
        },{
            route: 'reserve',
            name: '审计业务',
            icon: 'fa fa-calculator'
        },{
            route: 'reserve',
            name: '商标业务',
            icon: 'fa fa-trademark'
        },{
            route: 'reserve',
            name: '专利业务',
            icon: 'fa fa-cube'
        },{
            route: 'reserve',
            name: '业务审核',
            icon: 'fa fa-check-square-o'
        },{
            route: 'reserve',
            name: '业务汇总表',
            icon: 'fa fa-area-chart'
        }]
    }, {
        route: '',
        name: '快件登记管理',
        icon: 'fa fa-envelope-o',
        children:[{
            route: 'reserve',
            name: '快件列表',
            icon: 'fa fa-list'
        }]
    }, {
        route: '',
        name: '基本资料管理',
        icon: 'fa fa-university',
        children:[{
            route: 'organization',
            name: '组织架构',
            icon: 'fa fa-sitemap'
        },{
            route: 'area',
            name: '区域设置',
            icon: 'fa fa-crosshairs'
        },{
            route: 'position',
            name: '职位设置',
            icon: 'fa fa-graduation-cap'
        }]
    }]
};
