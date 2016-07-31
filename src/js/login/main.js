// require('normalize.css/normalize.css');
// require('css/main.scss');
// require('nice-validator/dist/jquery.validator.css');
// require('libs/jquery-confirm/jquery-confirm.min.css');
// var routing = require('./routes');

// require('libs/H5Uploader/H5Uploader')
// var httpHelper = require('js/utils/httpHelper');
// require('libs/jquery-confirm/jquery-confirm.min');


// angular
//   .module('app_login', ['ui.router'])
//   .config(httpHelper)
//   .config(routing)
//   .controller('BodyCtrl', require('./controller/body'));

require('bootstrap/dist/css/bootstrap.min.css');

require('css/main.scss');
require('nice-validator/dist/jquery.validator.css');

var routing = require('./routes');

var httpHelper = require('js/utils/httpHelper');
require('bootstrap/dist/js/bootstrap.min');
require('libs/lte/js/app');

angular
    .module('app', ['ui.router'])
    .config(httpHelper)
    .config(routing)
    .controller('BodyCtrl', require('./controller/body'));
