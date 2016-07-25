require('bootstrap/dist/css/bootstrap.min.css');

require('css/main.scss');
require('select2/dist/css/select2.css');
require('nice-validator/dist/jquery.validator.css');
require('libs/zTree/css/metroStyle/metroStyle.css');
// require('libs/datepicker/datepicker3.css');



var routing = require('./routes');

var httpHelper = require('js/utils/httpHelper');
require('bootstrap/dist/js/bootstrap.min');
require('libs/lte/js/app');
require('libs/H5Uploader/H5Uploader');
// require('libs/datepicker/bootstrap-datepicker');
require('libs/area/area');
require('libs/zTree/js/jquery.ztree.all')

angular
    .module('app', ['ui.router', 'ui.scrollpoint'])
    .config(httpHelper)
    .config(routing)
    .directive('pagination', require('../directive/pagination'))
    .controller('BodyCtrl', require('./controller/body'));
