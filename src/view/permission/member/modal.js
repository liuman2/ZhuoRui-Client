module.exports = function ($scope, $http, $state) {
    var role_id = $state.params.role_id || null;

    $scope.selectedMembers = {};

     $scope.search = {
        index: 1,
        size: 20,
        name: ""
    }

    $scope.data = {
        items: [],
        page: {
            current_index: 0,
            current_size: 0,
            total_page: 0,
            total_size: 0
        }
    };

    $scope.query = function() {
        load_data();
    };

    $scope.selectAll = function($event) {
        console.log($event.target.checked)

        $scope.isSelectAll = $event.target.checked;
        if ($scope.isSelectAll) {
            $scope.data.items.forEach(function (value, index, array) {
                if (!$scope.selectedMembers.hasOwnProperty(value.id)) {
                    $scope.selectedMembers[value.id] = value;
                }
            })
            $scope.currentIndexChecked = $scope.data.items.length;
        } else {
            $scope.data.items.forEach(function (value, index, array) {
                if ($scope.selectedMembers.hasOwnProperty(value.id)) {
                    delete $scope.selectedMembers[value.id];
                }
            })
            $scope.currentIndexChecked = 0;
        }
    };

    $scope.isSelected = (id) => {
        return $scope.selectedMembers.hasOwnProperty(id);
    }
    $scope.updateSelection = ($event, item) => {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        $scope.updateSelected(action, item);
    }

    $scope.updateSelected = (action, item) => {
        if (action == 'add' && !$scope.selectedMembers.hasOwnProperty(item.id)) {
            $scope.selectedMembers[item.id] = item;
            $scope.currentIndexChecked++;
        }
        if (action == 'remove' && $scope.selectedMembers.hasOwnProperty(item.id)) {
            delete $scope.selectedMembers[item.id];
            $scope.data.items.forEach(function (m, index) {
                if (m.id === item.id) {
                    $scope.currentIndexChecked--;
                }
            })
        }
        if ($scope.currentIndexChecked === $scope.data.items.length) {
            $scope.isSelectAll = true;
        } else {
            $scope.isSelectAll = false;
        }
    }

    $scope.save = function() {
        var ids = [];
        $.each($scope.selectedMembers, function (k, v) {
            ids.push(v.id);
        });

        if (!ids.length) {
            $state.go('^', { reload: false });
            return;
        }

        $http({
            method: 'POST',
            url: '/Role/SaveRoleMember',
            data: {
                roleId: role_id,
                memberIds: ids
            }
        }).success(function(data) {
            $scope.$emit('ROLE_MEMBER_MODAL_DONE');
            $state.go('^', { reload: true });
        });
    }

    function load_data() {
        $http({
            method: 'GET',
            params: $scope.search,
            url: '/Member/GetMembersForRole'
        }).success(function(data) {
            console.log(data)
            $scope.data = data;
        });
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    }

    load_data();
}
