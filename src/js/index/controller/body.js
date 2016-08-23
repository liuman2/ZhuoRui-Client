module.exports = function ($scope, $rootScope, $http, $cookieStore) {
    $scope.bodyClass = '';

    $scope.userInfo = {};

    /*$http({
        method: 'GET',
        url: '/Account/GetProfile'
    }).success(function (data) {
        $scope.userInfo = data.user;
        if (!data.user) {
            location.href = '/login.html';
        }
    }).error(function() {
        console.log(arguments)
    });*/

    var user = $cookieStore.get('USER_INFO');
    if (!user) {
        location.href = '/login.html';
    }

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
        }/*,{
            route: 'import',
            name: '导入正式客户',
            icon: 'fa fa-cloud-upload'
        }*/]
    }, {
        route: '',
        name: '订单管理',
        icon: 'fa fa-cart-arrow-down',
        children:[{
            route: 'abroad',
            name: '境外注册',
            icon: 'fa fa-globe'
        },{
            route: 'internal',
            name: '境内注册',
            icon: 'fa fa-street-view'
        },{
            route: 'audit',
            name: '审计订单',
            icon: 'fa fa-calculator'
        },{
            route: 'trademark',
            name: '商标订单',
            icon: 'fa fa-trademark'
        },{
            route: 'patent',
            name: '专利订单',
            icon: 'fa fa-cube'
        },{
            route: 'annual_warning',
            name: '年检预警',
            icon: 'fa fa-cube'
        },{
            route: 'annual',
            name: '年检列表',
            icon: 'fa fa-cube'
        },{
            route: 'reserve',
            name: '订单审核',
            icon: 'fa fa-check-square-o'
        },{
            route: 'reserve',
            name: '订单汇总表',
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
        },{
            route: 'member',
            name: '用户管理',
            icon: 'fa fa-user'
        },{
            route: 'dictionary',
            name: '数据字典',
            icon: 'fa fa-user'
        }]
    }, {
        route: '',
        name: '权限管理',
        icon: 'fa fa-lock',
        children:[{
            route: 'role',
            name: '角色管理',
            icon: 'fa fa-graduation-cap'
        },{
            route: 'role',
            name: '角色权限',
            icon: 'fa fa-key'
        },{
            route: 'role',
            name: '用户角色',
            icon: 'fa fa-unlock-alt'
        }]
    }, {
        route: '',
        name: '系统设置',
        icon: 'fa fa-cog',
        children:[{
            route: 'coding',
            name: '编码规则',
            icon: 'fa fa-file-text-o'
        }]
    }]
};
