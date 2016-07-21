module.exports = function ($scope, $http) {
    $scope.$parent.$parent.bodyClass = 'grey';
    //初始params
    $scope.params = {
        index: 1,
        size: 1
    }
    getList();

    function getList() {

        $http({
            method: 'GET',
            url: '/messages',
            params: $scope.params
        }).success(function (data) {
            $scope.data = data;
            $scope.start = $scope.data.page.current_index > 3 && $scope.data.page.total_page !== 4 ? $scope.data.page.total_page - 2 <= $scope.data.page.current_index ? $scope.data.page.total_page - 3 : $scope.data.page.current_index - 1 : 2;
            $scope.end = $scope.start + 2 >= $scope.data.page.total_page ? $scope.data.page.total_page - 1 : $scope.start + 2;
            $scope.pageArr = function () {
                var input = [];
                for (var i = $scope.start; i <= $scope.end; i++) {
                    input.push(i);
                }
                return input;
            };
        })
    }

    //跳转分页，$scope.page
    $scope.pageGo = () => {
        if ($scope.goPage > $scope.data.page.total_page) {
            $scope.goPage = '';
            return false;
        }
        $scope.params.index = $scope.goPage;
        getList();
        $scope.goPage = ''
    }

    //选中分页跳转
    $scope.pagination = function ($event) {
        var $element = angular.element($event.target);
        var $elementP = $element.parent();

        if ($elementP.hasClass('disabled')) {
            return false;
        } else if ($element.hasClass('previous')) {
            $scope.params.index--;
        } else if ($element.hasClass('next')) {
            $scope.params.index--;
        } else if ($element.hasClass('first')) {
            $scope.params.index = 1;
        } else if ($element.hasClass('last')) {
            $scope.params.index = $scope.data.page.total_page;
        } else {
            $scope.params.index = $element.text();
            if ($scope.params.index === $scope.data.page.current_index) {
                return false;
            }
        }

        if ($scope.params.index <= 0 || $scope.params.index > $scope.data.page.total_page) {
            return false;
        }

        getList();
    }
}