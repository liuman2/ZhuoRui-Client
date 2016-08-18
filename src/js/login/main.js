require('bootstrap/dist/css/bootstrap.min.css');
require('angular-loading-bar/build/loading-bar.css');

require('libs/fontawesome/css/font-awesome.css');
require('libs/lte/css/AdminLTE.css');
require('libs/lte/css/skins/skin-blue.css');

require('css/main.scss');
require('nice-validator/dist/jquery.validator.css');
var routing = require('./routes');
var httpHelper = require('js/utils/httpHelper');
require('bootstrap/dist/js/bootstrap.min');
require('libs/lte/js/app');



angular
    .module('login_app', ['ui.router', 'angular-loading-bar', 'ngCookies'])
    .config(httpHelper)
    .config(routing)
    .controller('BodyCtrl', require('./controller/body'));
