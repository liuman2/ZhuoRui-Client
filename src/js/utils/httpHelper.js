var prefix = '';
var regPrefix = new RegExp(`^\/?${prefix}\/`, 'i');

function addPrefix(url) {
    url = _prettify(url);

    if (!regPrefix.test(url)) {
        return `/${prefix}${url}`;
    } else {
        return url;
    }
}

function _prettify(url) {
    if (typeof url === 'string' && url.length > 0) {
        if (!/^\//i.test(url)) {
            return `/${url}`;
        } else {
            return url;
        }
    } else {
        return '';
    }
}


module.exports = exports = function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
        return {
            'request': function(config) {
                config.url = addPrefix(config.url);
                var method = config.method.toLowerCase();
                if (method === 'get' || method === 'delete') {
                    config.url += `?s=${Math.random()}`;
                }
                return config;
            },
            'responseError': function(rejection) {
                if (rejection.config.errorHandler !== false) {
                    if (rejection.status == 401 || rejection.status == 404) {
                        location.href = '/login.html';
                        return;
                    } else {
                        if (rejection.data && rejection.data.message) {
                            var tilte = rejection.status >= 500 ? '错误' : '警告';
                            // TODO
                            $.alert({
                                title: tilte,
                                content: rejection.data.message,
                                confirmButton: "确定"
                            });
                        }
                    }
                }
                // if (canRecover(rejection)) {
                //   return responseOrNewPromise
                // }
                return $q.reject(rejection);
            }
        };
    });
};

exports.url = addPrefix;
