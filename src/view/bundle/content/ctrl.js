module.exports = function ($scope, $http, $state) {

    $scope.setLists = (type, index) => {
        $scope.data.items.splice(index, 1);//删除
        if (type === 'up') {
            $scope.data.items.splice(index - 1, 0, currentList);//在前一个添加
        } else if (type === 'down') {
            $scope.data.items.splice(index + 1, 0, currentList);//在后一个添加
        }
    }

    $scope.goLibrary = () => {
        $scope.selectedId = [];
        $scope.selectedTags = [];
        $state.go('.courses', {}, {location: false});
    }

    $scope.$watch(function () {
        return $scope.selectedCourses;
    }, function (newValue, oldValue) {
        if (newValue.length) {
            $scope.data.items = $scope.data.items.concat(newValue);
            console.log($scope.data.items);
        }
    })
}
