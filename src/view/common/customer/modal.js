module.exports = function ($scope, $http, $state) {
    $('body').css('overflow', 'hidden');
    $scope.isSelectAll = false;
    $scope.count = 0;
    $scope.currentIndexChecked = 0;
    $scope.selectedTags = {};
    $scope.courses = {};
    $scope.page_go = '';

    $scope.params = {
        index: 1,
        size: 10,
        industry_id: '',
        post_id: '',
        experience_id: '',
        name: '',
        field_group: 'attribute',
        exclude: $scope.exclude.join(',')
    }

    getCourses();
    getIndustry();
    getExperience();

    $scope.getPost = function () {
        $http({
            method: 'GET',
            url: '/scope/post',
            params: {
                industry_id: $scope.params.industry_id
            }
        }).success(function (data) {
            console.log('岗位：', data);
            $scope.post = data;
        })
    }

    $scope.updateCourses = () => {
        $scope.params.index = 1;
        $scope.currentIndexChecked = 0;
        getCourses();
    }

    $scope.changeIndustry = function () {
        $scope.getPost();
        $scope.updateCourses();
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
            $scope.currentIndexChecked = 0;
            getCourses();
        }
    }

    $scope.verify = function () {
        $scope.inputNumber = $scope.inputNumber.replace(/[^\d]/ig, '').replace(/^0+/ig, '');
    }

    $scope.goPage = ($event) => {
        var keycode = window.event ? $event.keyCode : $event.which;//获取按键编码
        if (keycode === 13) {
            if (parseInt($event.target.value) === parseInt($scope.courses.page.current_index)) {
                $event.target.value = '';
                return false;
            } else {
                $scope.params.index = parseInt($event.target.value);
                $scope.currentIndexChecked = 0;
                getCourses();
                $event.target.value = '';
            }
        }
        $event.stopPropagation();
    }

    $scope.updateSelected = (action, id, name) => {
        if (action == 'add' && !$scope.selectedTags.hasOwnProperty(id)) {
            $scope.selectedTags[id] = {id: id, name: name, type: "course"};
            $scope.count++;
            $scope.currentIndexChecked++;
        }
        if (action == 'remove' && $scope.selectedTags.hasOwnProperty(id)) {
            delete $scope.selectedTags[id];
            $scope.count--;
            $scope.courses.items.forEach(function (item, index) {
                if (item.id === id) {
                    $scope.currentIndexChecked--;
                }
            })
        }
        if ($scope.currentIndexChecked === $scope.courses.items.length) {
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
        return $scope.selectedTags.hasOwnProperty(id);
    }
    $scope.selectAll = ($event) => {
        $scope.isSelectAll = $event.target.checked;
        if ($scope.isSelectAll) {
            $scope.courses.items.forEach(function (value, index, array) {
                if (!$scope.selectedTags.hasOwnProperty(value.id)) {
                    $scope.selectedTags[value.id] = {id: value.id, name: value.name, type: "course"};
                    $scope.count++;
                }
            })
            $scope.currentIndexChecked = $scope.courses.items.length;
        } else {
            $scope.courses.items.forEach(function (value, index, array) {
                if ($scope.selectedTags.hasOwnProperty(value.id)) {
                    delete $scope.selectedTags[value.id];
                    $scope.count--;
                }
            })
            $scope.currentIndexChecked = 0;
        }
    }
    $scope.insertNodes = () => {
        $scope.$parent.selectedCourses = $scope.selectedTags;
        $('body').css('overflow', 'auto');
    }
    $scope.cancelInsertNodes = () => {
        $('body').css('overflow', 'auto');
    }
    $scope.formatDate = function (dt) {
        return moment(dt).format("YYYY-MM-DD HH:mm:ss");
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
            checkedAll();
        })
    }

    function getIndustry() {
        $http({
            method: 'GET',
            url: '/scope/industry'
        }).success(function (data) {
            console.log('行业：', data);
            $scope.industry = data;
            $scope.industry.items.forEach(function (item, index) {
                if (item.children) {
                    if (item.children.length) {
                        item.children.forEach(function (child, idx) {
                            child.isChild = '　';
                            $scope.industry.items.splice(index + 1, 0, child);
                        })
                    }
                }
            })
        })
    }

    function getExperience() {
        $http({
            method: 'GET',
            url: '/scope/experience'
        }).success(function (data) {
            console.log('工作经验：', data);
            $scope.experience = data;
        })
    }

    function checkedAll() {
        $scope.courses.items.forEach(function (value, index, array) {
            if ($scope.selectedTags.hasOwnProperty(value.id)) {
                $scope.currentIndexChecked++;
            }
        })
        if ($scope.currentIndexChecked === $scope.courses.items.length) {
            $scope.isSelectAll = true;
        } else {
            $scope.isSelectAll = false;
        }
    }
}
