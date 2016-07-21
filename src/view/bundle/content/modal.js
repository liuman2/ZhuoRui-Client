module.exports = function ($scope, $http, $state) {
    $scope.isSelectAll = false;
    $scope.selectedId = []; //store ids
    $scope.selectedTags = [];  //store nodes
    $scope.courses = {};
    $scope.page_go = '';

    $scope.params = {
        index: 1,
        size: 10,
        name: ''
    }
    getCourses();

    $scope.updateCourses = () => {
        $scope.params.index = 1;
        getCourses();
    }
    $scope.selectPage = ($event) => {
        var $element = angular.element($event.target);
        if ($element.hasClass('disabled')) {
            return false
        } else {
            if ($element.hasClass('pager-first')) {
                $scope.params.index = 1;
            } else if ($element.hasClass('pager-last')) {
                $scope.params.index = $scope.courses.page.total_page;
            } else if ($element.hasClass('pager-pre') && $scope.params.index > 1) {
                $scope.params.index--;
            } else if ($element.hasClass('pager-next') && $scope.params.index < $scope.courses.page.total_page) {
                $scope.params.index++;
            }
            getCourses();
        }
    }

    $scope.goPage = ($event) => {
        var keycode = window.event ? $event.keyCode : e.which;//获取按键编码
        if (keycode === 13) {
            $scope.params.index = $event.target.value;
            getCourses();
            $event.target.value = '';
        }
        $event.stopPropagation();
    }

    function getCourses() {
        $http({
            method: 'GET',
            url: '/courses',
            params: $scope.params
        }).success(function (data) {
            $scope.courses = data;
            console.log($scope.courses);
            console.log('当前页：', $scope.courses.page.current_index);
            if ($scope.courses.page.current_index > $scope.courses.page.total_page) {
                setTimeout(function () {
                    $scope.params.index = 1;
                    getCourses();
                }, 1500)
            }
        })
    }

    $scope.updateSelected = (action, id, name) => {
        if (action == 'add' && $scope.selectedId.indexOf(id) == -1) {
            var node = {id: id, name: name, type:"course"};
            $scope.selectedId.push(id);
            $scope.selectedTags.push(node);
        }
        if (action == 'remove' && $scope.selectedId.indexOf(id) != -1) {
            var idx = $scope.selectedId.indexOf(id);
            $scope.selectedId.splice(idx, 1);
            $scope.selectedTags.splice(idx, 1);
        }
        if ($scope.selectedId.length === $scope.courses.items.length) {
            $scope.isSelectAll = true;
        } else {
            $scope.isSelectAll = false;
        }
    }
    $scope.updateSelection = ($event, id) => {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        $scope.updateSelected(action, id, checkbox.name);
    }
    $scope.isSelected = (id) => {
        return $scope.selectedId.indexOf(id) >= 0;
    }
    $scope.selectAll = ($event) => {
        $scope.isSelectAll = $event.target.checked;
        if ($scope.isSelectAll) {
            $scope.count = $scope.courses.items.length;
            $scope.courses.items.forEach(function (value, index, array) {
                if ($scope.selectedId.indexOf(value.id) == -1) {
                    var node = {id: value.id, name: value.name, type:"course"};
                    $scope.selectedId.push(value.id);
                    $scope.selectedTags.push(node);
                }
            })
        } else {
            $scope.count = 0;
            $scope.selectedId = [];
            $scope.selectedTags = [];
        }
    }
    $scope.insertNodes = () => {
        $scope.$parent.selectedCourses = $scope.selectedTags;
        console.log($scope.$parent.selectedCourses);
    }
}