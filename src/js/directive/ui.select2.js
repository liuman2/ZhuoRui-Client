var httpHelper = require('js/utils/httpHelper');

angular.module('ui.select2', []).directive('uiSelect2', ['$timeout', function($timeout, $http) {
    return {
        require: "ngModel",
        restrict: "EA",
        // scope: {
        //     displayName: "@"
        // },
        link: function(scope, element, attrs, ngModel) {
            var url = attrs['url'];
            $(element).select2({
                language: "zh-CN",
                placeholder: "",
                // allowClear: true,
                maximumSelectionSize: 8,
                ajax: {
                    url: httpHelper.url(url),
                    type: 'GET',
                    dataType: 'json',
                    data: function(params) {
                        return {
                            name: params.term || '',
                            index: params.page || 1,
                            size: 10
                        };
                    },
                    processResults: function(data, params) {
                        params.page = params.page || 1;
                        $.map(data.items, function(item) {
                            item.text = item.name;
                        });
                        return {
                            results: data.items,
                            pagination: {
                                more: params.page < data.page.total_page
                            }
                        };
                    }
                }
            });

            $(element).on("change", function() {
                ngModel.$modelValue = element.val();
                scope.data[ngModel.$name] = ngModel.$modelValue;
                // for (var o in scope.data) {
                //     console.log(o)
                //     console.log(scope.data[o])
                // }

                // var arr = $(element).select2("data");
                // if (arr.length >= 1) {
                //     scope.displayName = arr[0].text;
                // }
            });
            // attrs.$observe("displayName", function(value) {
            //     console.log(value)
            //     // if (value) {
            //     //     var option = "<option value='" + ngModel.$modelValue + "'>" + scope.displayName + "</option>";
            //     //     element.append(option).val(ngModel.$modelValue).trigger('change');
            //     // }
            // });
            // $timeout(function() {
            //     $(element).val(ngModel.$modelValue).trigger("change");
            // }, 400);
        }
    }
}]);
