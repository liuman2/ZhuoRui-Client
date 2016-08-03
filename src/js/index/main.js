require('bootstrap/dist/css/bootstrap.min.css');
require('angular-loading-bar/build/loading-bar.css');
require('css/main.scss');
require('select2/dist/css/select2.css');
require('nice-validator/dist/jquery.validator.css');
require('libs/zTree/css/metroStyle/metroStyle.css');

var routing = require('./routes');

var httpHelper = require('js/utils/httpHelper');
require('bootstrap/dist/js/bootstrap.min');
require('libs/lte/js/app');
require('libs/H5Uploader/H5Uploader');

require('libs/area/area');
require('libs/zTree/js/jquery.ztree.all');
require('../directive/ui.select2');

angular
    .module('app', ['ui.router', 'ui.scrollpoint', 'ui.select2', 'angular-loading-bar'])
    .config(httpHelper)
    .config(routing)
    .directive('pagination', require('../directive/pagination'))
    .controller('BodyCtrl', require('./controller/body'));
