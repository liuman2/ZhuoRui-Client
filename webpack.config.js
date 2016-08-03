var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var config = require('./config');

var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var SpritesmithPlugin = require('webpack-spritesmith');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var nodeModulesPath = path.join(__dirname, 'node_modules');

var vendor = [
];

var vendor2IE8 = [
    'es5-shim',
    'html5shiv',
    'respond.js/dest/respond.min.js'
];

var webpackConfig = {
    entry: {
        common: [
            'jquery',
            'angular/angular.js',
            'angular-ui-router',
            'angular-ui-scrollpoint',
            'angular-loading-bar',
            'select2',
            'select2/dist/js/i18n/zh-CN.js',
            'nice-validator/dist/jquery.validator.js',
            'nice-validator/dist/local/zh-CN.js',
            'jquery-datetimepicker',
            'libs/fontawesome/css/font-awesome.css',
            'libs/lte/css/AdminLTE.css',
            'libs/lte/css/skins/skin-blue.css'
        ]
    },
    output: {
        path: path.join(config.path.dist),
        publicPath: '/',
        filename: config.isPro ? 'js/[name].[chunkhash].js' : 'js/[name].js'
    },
    module: {
        loaders: [
            // {test: /\.js$/, loader: 'ng-annotate'},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    plugins: [
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals'
                    ],
                    presets: ['es2015-loose']
                }
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
                include: [path.resolve(config.path.src), nodeModulesPath]
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
                include: [path.resolve(config.path.src), nodeModulesPath]
            }, {
                test: /\.(jpg|png|gif)$/i,
                loader: `file-loader?name=img/[name]${config.env === 'production' ? '-[hash:10]' : ''}.[ext]`
            }, {
                test: /\.swf$/i,
                loader: `file-loader`
            }, {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader?name=fonts/[name].[ext]',
                include: [path.resolve(config.path.src), nodeModulesPath]
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        // modulesDirectories: ['web_modules', 'node_modules', 'dist/sprite'],
        extensions: ['', '.js', 'css', 'scss', 'png', 'jpg', 'jpeg', 'gif'],
        alias: {
            js: path.join(config.path.src, '/js'),
            css: path.join(config.path.src, '/css'),
            img: path.join(config.path.src, '/img'),
            view: path.join(config.path.src, '/view'),
            libs: path.join(config.path.src, '/libs')
        }
    },
    plugins: [
        // new CleanWebpackPlugin(config.path.dist),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: config.isPro ? 'js/common.[chunkhash].js' : 'js/common.js',
            chunks: config.route
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ExtractTextPlugin('css/[name].css'),
        // new SpritesmithPlugin({
        //   src: {
        //     cwd: path.join(config.path.src, '/img/icon'),
        //     glob: '*.png'
        //   },
        //   target: {
        //     image: path.join(config.path.dist, '/sprite/sprite.png'),
        //     css: path.join(config.path.dist, '/sprite/sprite.scss')
        //   },
        //   apiOptions: {
        //     cssImageRef: "~sprite.png"
        //   }
        // }),
        new HtmlPlugin()
    ]
};

// for pro
if (config.isPro) {
    webpackConfig.plugins.push(
        // new NgInject(),
        // uglify
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            compress: {
                drop_debugger: true,
                drop_console: true,
                warnings: false
            },
            output: {
                comments: false,
                semicolons: true
            },
            sourceMap: false
        }),
        // clean
        new CleanWebpackPlugin(config.path.dist)
    );
}

// gen entry content
config.route.forEach(item => {
    if (item === 'copyright') {
        var htmlPlugin = new HtmlWebpackPlugin({
            filename: item + '.html',
            template: `src/${item}.html`,
            chunks: ['common']
        });

        webpackConfig.plugins.push(htmlPlugin);
    } else {
        webpackConfig.entry[item] = path.join(config.path.src, `/js/${item}/main.js`);

        var htmlPlugin = new HtmlWebpackPlugin({
            filename: item + '.html',
            template: `src/${item}.html`,
            chunks: ['common', item],
            minify: !config.isPro ? false : {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            }
        });

        webpackConfig.plugins.push(htmlPlugin);
    }
});

// for angular
// =========================================================
if (config.isPro) {
    webpackConfig.plugins.push(new ngAnnotatePlugin({
        add: true
    }));
}

// console.log(webpackConfig);
module.exports = webpackConfig;


// plugins =================================================
function HtmlPlugin(options) {}
HtmlPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            htmlPluginData.html = setHtmlScript(htmlPluginData.html);
            callback(null, htmlPluginData);
        });
    });
};


// =========================================================

function setHtmlScript(html) {
    var vendorString = genScriptString(getNpmModulePath(vendor));

    html = html.replace(/\n?<\/body>/ig,
        vendorString + '</body>');

    // for ie8
    var ie8String = genScriptString(getNpmModulePath(vendor2IE8));
    ie8String = `<!--[if lte IE 9]>${ie8String}<![endif]-->`;
    // ie8String = `${ie8String}`;
    html = html.replace(/\n?<\/head>/ig,
        ie8String + '</head>');

    return html;
}

function genScriptString(jsList) {
    var str = '';
    for (var moduleName in jsList) {
        var vendorPath = jsList[moduleName];
        var scriptPath = path.join('vendor', `${moduleName}${path.extname(vendorPath)}`);
        var distPath = path.join(config.path.dist, scriptPath);
        fse.copy(vendorPath, distPath, function(err) {});

        str += `<script src="${scriptPath}"></script>`;
    }
    return str;
}

function getNpmModulePath(npmModuleList) {
    var pathList = []
    var modules = {};
    for (var i in npmModuleList) {
        var moduleName = npmModuleList[i];
        var filePath = null;

        if (moduleName.indexOf('/') > -1) {
            var pathSplit = moduleName.split('/');
            moduleName = pathSplit[0];

            filePath = path.join(nodeModulesPath, npmModuleList[i]);
        } else {
            var modulePath = `${nodeModulesPath}/${moduleName}`;
            var pkg = require(`${modulePath}/package.json`);

            if (pkg.main) {
                filePath = path.join(modulePath, pkg.main);
            }
        }

        if (path.extname(filePath) === '') {
            filePath += '.js';
        }

        if (modules[moduleName]) {
            var fileParse = path.parse(filePath);
            modules[moduleName + '.' + fileParse.name] = filePath;
        } else {
            modules[moduleName] = filePath;
        }
        pathList.push(filePath);

    }

    return modules;
}


// ====== auto add 'ngInject';
function NgInject(options) {}
NgInject.prototype.apply = function(compiler) {
    var options = this.options;

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('optimize-chunk-assets', function(chunks, callback) {
            var files = [];

            function getFilesFromChunk(chunk) {
                files = files.concat(chunk.files);
            }

            function addNgInject(file) {
                if (path.extname(file) !== '.js') {
                    return false;
                }
                // console.log(compilation.assets[file]);
            }

            chunks.forEach(getFilesFromChunk);

            files = files.concat(compilation.additionalChunkAssets);

            files.forEach(addNgInject);

            // console.log(files);
            callback();
        });
    });
}
