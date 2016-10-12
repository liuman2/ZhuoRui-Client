module.exports = function ($scope, $http, $state) {
    var customer_id =  $state.params.customer_id,
        audit_id = $state.params.audit_id;


    $scope.selectedMembers = {};

     $scope.search = {
        index: 1,
        size: 20,
        audit_id: audit_id,
        customer_id: customer_id,
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
            url: '/Audit/AddAuditBank',
            data: {
                audit_id: audit_id,
                customer_id: customer_id,
                bankIds: ids
            }
        }).success(function(data) {
            $scope.$emit('AUDIT_BANK_DONE');
            $state.go('^', { reload: true });
        });
    }

    function load_data() {
        $http({
            method: 'GET',
            params: $scope.search,
            url: '/Audit/GetAuditBanks'
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
