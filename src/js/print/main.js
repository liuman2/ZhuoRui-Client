require('bootstrap/dist/css/bootstrap.min.css');
require('angular-loading-bar/build/loading-bar.css');
require('css/main.scss');
var httpHelper = require('js/utils/httpHelper');
require('libs/lte/js/app');

angular
    .module('print_app', ['ui.router', 'angular-loading-bar', 'ngCookies'])
    .config(httpHelper)
    .controller('BodyCtrl', require('./controller/body'));
