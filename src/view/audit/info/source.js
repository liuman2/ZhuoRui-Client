module.exports = function($scope, $http, $state) {
    var customer_id = $state.params.customer_id,
        type = $state.params.type;

    $scope.selectedSource = {};

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

    $scope.isSelected = (id) => {
        return $scope.selectedSource.hasOwnProperty(id);
    }
    $scope.updateSelection = ($event, item) => {
        // var checkbox = $event.target;
        // var action = (checkbox.checked ? 'add' : 'remove');
        // $scope.updateSelected(action, item);
        $scope.selectedSource = item;
    }

    // $scope.updateSelected = (action, item) => {
    //     if (action == 'add' && !$scope.selectedSource.hasOwnProperty(item.id)) {
    //         $scope.selectedSource[item.id] = item;
    //         $scope.currentIndexChecked++;
    //     }
    //     if (action == 'remove' && $scope.selectedSource.hasOwnProperty(item.id)) {
    //         delete $scope.selectedSource[item.id];
    //         $scope.data.items.forEach(function (m, index) {
    //             if (m.id === item.id) {
    //                 $scope.currentIndexChecked--;
    //             }
    //         })
    //     }
    //     if ($scope.currentIndexChecked === $scope.data.items.length) {
    //         $scope.isSelectAll = true;
    //     } else {
    //         $scope.isSelectAll = false;
    //     }
    // }

    $scope.save = function() {

        if (!$scope.selectedSource.id) {
            $state.go('^', {}, { reload: false });
            return;
        }


        console.log($scope.selectedSource.id)

        $scope.$emit('SOURCE_DONE', $scope.selectedSource);

        $state.go('^', {}, { reload: false });
    }

    function load_data() {
        $http({
            method: 'GET',
            params: {
                customer_id: customer_id,
                type: type
            },
            url: '/Annual/GetSourceForAudit'
        }).success(function(data) {
            console.log(data)
            $scope.sources = data;
        });
    }

    $scope.go = function(index) {
        $scope.search.index = index;
        load_data();
    }

    load_data();
}
