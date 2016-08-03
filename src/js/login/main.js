require('bootstrap/dist/css/bootstrap.min.css');
require('angular-loading-bar/build/loading-bar.css');
require('css/main.scss');
require('nice-validator/dist/jquery.validator.css');
var routing = require('./routes');
var httpHelper = require('js/utils/httpHelper');
require('bootstrap/dist/js/bootstrap.min');
require('libs/lte/js/app');

angular
    .module('app', ['ui.router', 'angular-loading-bar'])
    .config(httpHelper)
    .config(routing)
    .controller('BodyCtrl', require('./controller/body'));
