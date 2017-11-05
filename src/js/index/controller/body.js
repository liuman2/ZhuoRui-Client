module.exports = function ($scope, $rootScope, $http, $cookieStore, $timeout) {
    $scope.bodyClass = '';

    $scope.userInfo = {};
    $scope.menus = [];

    var user = $cookieStore.get('USER_INFO');
    if (!user) {
        location.href = '/login.html';
    }

    $http({
        method: 'GET',
        url: '/Account/GetProfile'
    }).success(function (data) {
        $scope.menus = data.menus;
        $scope.userInfo = data.user;
        $scope.opers = data.opers;
        if (!data.user) {
            location.href = '/login.html';
        }

        data.user.url = data.user.url;
        $cookieStore.put('USER_OPERS', data.opers);
        $cookieStore.put('USER_PROFILE', data.user);

    }).error(function () {
    });

    $scope.exit = function () {
        $http({
            method: 'GET',
            url: '/Account/SignOut'
        }).success(function () {
            location.href = '/login.html';
        }).error(function () {
            location.href = '/login.html';
        });
    }

    $scope.$on('PROFILE_DONE', function (e) {
        $scope.userInfo = $cookieStore.get('USER_PROFILE');
        $scope.$apply();
    });

    $scope.$on('HAS_READ', function (e) {
        GetMessageInfo();
        $scope.$apply();
    });

    function GetMessageInfo() {
        $http({
            method: 'GET',
            url: '/Home/WaitdealCount'
        }).success(function (data) {
            $scope.Waitdeal = data;
        }).error(function () {
        });
    }

    GetMessageInfo();

    function getNotification() {
        $http({
            method: 'GET',
            url: '/Schedule/GetNotification'
        }).success(function (data) {
            console.log(data);
            data = data || [];
            if (!data.length) {
                return;
            }

            var title = `您有以下${data.length}笔事项需要处理`;
            var rows = '';

            data.forEach(function(item, i) {
                rows += `<tr id="notify_${item.id}"><td><input type="checkbox" class="notify_checkbox" attr-id="${item.id}" /></td><td>${item.title}</td><td>${item.memo}</td><td>${item.dealt_date ? item.dealt_date.substr(0, 10) : ''}</td><td style="text-align:center;">${item.business_code || '-'}</td></tr>`;
            });

            var content = 
            '<div>\
                <h4>'+title+'</h4>\
                <table class="table table-hover">\
                <tbody>\
                    <tr>\
                    <th style="width:100px;">完成</th>\
                    <th style="width:200px;">事项</th>\
                    <th style="width:300px;">内容</th>\
                    <th style="width:160px;">待办日期</th>\
                    <th style="width:160px;text-align:center;">档案号</th>\
                    </tr>' + rows +'</tbody >\
                </table >\
            </div >';

            layer.open({
                title: '提醒'
                , type: 0
                , offset: 'rb' //具体配置参考：offset参数项
                , area: ['700px', '300px']
                , content: content
                , btn: '关闭'
                , btnAlign: 'r'
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });

            $('.notify_checkbox').on('change', function (e) {
                var isCheck = $(e.target).prop('checked');

                $http({
                    method: 'GET',
                    params: {
                        id: $(e.target).attr('attr-id'),
                        isDone: isCheck
                    },
                    url: '/Schedule/SetDone'
                }).success(function (data) {
                    if (isCheck) {
                        $(e.target).closest('tr').addClass('tr-done');
                    } else {
                        $(e.target).closest('tr').removeClass('tr-done');
                    }
                });                
            })
        });
    }

    $timeout(function () {
        getNotification();
        setInterval(getNotification, 1000 * 60 * 10);
    }, 5000);
};
