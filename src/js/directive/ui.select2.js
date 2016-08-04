var httpHelper = require('js/utils/httpHelper');

angular.module('ui.select2', []).directive('uiSelect2', ['$timeout', function($timeout, $http) {
    return {
        require: "ngModel",
        restrict: "EA",
        // scope: {
        //     displayName: "@"
        // },
        link: function(scope, element, attrs, ngModel) {
            var url = attrs['url'],
                param_value = attrs['paramvalue'] || '',
                param_field = attrs['paramfield'] || '',
                ngView = attrs['ngView'] || '',
                ispagging = attrs['paging'];


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
                        var _params = {};
                        _params['name'] = params.term || '';
                        if (ispagging === 'true') {
                            _params['index'] = params.page || 1;
                            _params['size'] = 20;
                        }
                        if (param_field) {
                            _params[param_field] = param_value;
                        }
                        return _params;
                    },
                    processResults: function(data, params) {
                        params.page = params.page || 1;
                        $.map(data.items, function(item) {
                            item.text = item.name;
                        });

                        if (!data.page) {
                            data.page = {
                                total_page: 1
                            }
                        }
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
                if (scope.data) {
                    scope.data[ngModel.$name] = ngModel.$modelValue;
                }
            });
            // attrs.$observe("displayName", function(value) {
            //     console.log(value);
            // });
            $timeout(function() {
                // $(element).val(ngModel.$modelValue).trigger("change");

                if (ngModel.$modelValue) {
                    var viewValue = ngModel.$viewValue;
                    if (ngView) {
                        viewValue = scope.data[ngView];
                    }
                    var option = "<option value='" + ngModel.$modelValue + "'>" + viewValue + "</option>";
                    $(element).append(option).val(ngModel.$modelValue).trigger('change');
                }
            }, 400);
        }
    }
}]);
