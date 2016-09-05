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
                ispagging = attrs['paging'],
                allowclear = attrs['allowclear']==="true" || false;

            var display_fields = attrs['formatfields'] || ''
            var format_captions = attrs['formatcaptions'] || ''
            var options = {
                language: "zh-CN",
                placeholder: "",
                allowClear: allowclear,
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
            };

            function formatState(state) {
                if (!state.id) {
                    return state.text;
                }

                var fields = display_fields.split(',');
                var captions = format_captions.split(',');

                var $state = $(
                    '<div class="custom-select-item">\
                        <div>\
                            <label class="caption">' + captions[0] + ': </label><span>' + state[fields[0]] + '</span>\
                        </div>\
                        <div>\
                            <label class="caption">' + captions[1] + ': </label><span>' + state[fields[1]] + '</span>\
                        </div>\
                    </div>'
                );
                return $state;
            };

            if (display_fields) {
                options.templateResult = formatState
            }

            $(element).select2(options);

            $(element).on("change", function() {
                ngModel.$modelValue = element.val();
                /*if (scope.data && typeof(scope.data[ngModel.$name]) != 'undefined') {
                    scope.data[ngModel.$name] = ngModel.$modelValue;
                }
                if (scope.search && typeof(scope.search[ngModel.$name]) != 'undefined') {
                     scope.search[ngModel.$name] = ngModel.$modelValue;
                }
                if (scope.income && typeof(scope.income[ngModel.$name]) != 'undefined') {
                     scope.income[ngModel.$name] = ngModel.$modelValue;
                }*/
                if (scope.data) {
                    scope.data[ngModel.$name] = ngModel.$modelValue;
                }
                if (scope.search) {
                     scope.search[ngModel.$name] = ngModel.$modelValue;
                }
                if (scope.income) {
                     scope.income[ngModel.$name] = ngModel.$modelValue;
                }
                if (scope.progress) {
                     scope.progress[ngModel.$name] = ngModel.$modelValue;
                }
            });

            scope.$watch(attrs.ngModel, function(opts) {
                // console.log(arguments)
            }, true);

            $timeout(function() {
                if (ngModel.$modelValue) {
                    var viewValue = ngModel.$viewValue;
                    if (ngView) {
                        if (scope.data && scope.data[ngView] !== undefined) {
                            viewValue = scope.data[ngView];
                        }
                        if (scope.search && scope.search[ngView] !== undefined) {
                            viewValue = scope.search[ngView];
                        }
                    }

                    var option = "<option value='" + ngModel.$modelValue + "'>" + viewValue + "</option>";
                    $(element).append(option).val(ngModel.$modelValue).trigger('change');
                }
            }, 400);
        }
    }
}]);
