module.exports = function($scope, $state, $timeout) {
    $scope.info_init = function() {

        $scope.tag_ids = [];
        $.map($scope.data.attribute.tags, function(item) {
            $scope.tag_ids.push(item.id);
        });

        $scope.range_ids = '';
        if ($scope.data.attribute.industry_id && $scope.data.attribute.post_id && $scope.data.attribute.experience_id) {
            $scope.range_ids = $scope.data.attribute.industry_id + '' + $scope.data.attribute.post_id + '' + $scope.data.attribute.experience_id;
        }
    }

    $scope.$watch(function() {
        return $scope.data.attribute.tags;
    }, function(newValue, oldValue) {
        if (!oldValue.length && newValue.length) {
            $timeout(function() {
                $.map($scope.data.attribute.tags, function(item) {
                    $scope.tag_ids.push(item.id);
                });
                $timeout(function() {
                    $("#tagsSelect").val($scope.tag_ids).trigger("change");
                });
            });
        }
    })

    $scope.$on('rangeDone', function(e, ranges) {
        $scope.data.attribute.industry_id = ranges.industry_id;
        $scope.data.attribute.industry_name = ranges.industry_name;
        $scope.data.attribute.post_id = ranges.post_id;
        $scope.data.attribute.post_name = ranges.post_name;
        $scope.data.attribute.experience_id = ranges.experience_id;
        $scope.data.attribute.experience_name = ranges.experience_name;
        $scope.range_ids = $scope.data.attribute.industry_id + '' + $scope.data.attribute.post_id + '' + $scope.data.attribute.experience_id;
        $timeout(function() {
            $('.range-ids').trigger("validate");
        });
    });

    $scope.$on('imageUploadSuccess', function(e, id, url) {
        $scope.data.cover_url = url;
        $scope.data.cover_id = id;
        $timeout(function() {
            $('input[name="cover_url"]').trigger("validate");
        });
    });

    var jForm = $('.detail-view-body');
    jForm.validator({
        rules: {},
        fields: {}
    });

    $("#tagsSelect").on("change", function(e) {
        var tags = $(e.target).select2('data');
        if (!tags) {
            $scope.data.attribute.tags = [];
            return;
        }
        if (tags.length == 0) {
            $scope.data.attribute.tags = [];
            return;
        }
        $scope.data.attribute.tags = [];
        $.map(tags, function(item) {
            $scope.data.attribute.tags.push({
                id: item.id,
                name: item.text
            });
        })
    });
};
