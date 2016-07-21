var config = require('../config');
var chalk = require('chalk');

// webpack module
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require("../webpack.config.js");

// port
var PORT = config.devServer.port;

// hot module
config.route.forEach(item => {
  if (typeof webpackConfig.entry[item] == 'string') {
    webpackConfig.entry[item] = [
      webpackConfig.entry[item]
    ];
  }
  webpackConfig.entry[item].unshift(
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/dev-server');
});
// add dev options
Object.assign(webpackConfig, {
  devtool: 'source-map',
  debug: true
});
// for dev
webpackConfig.output.publicPath = `http://127.0.0.1:${PORT}/`;
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

// compiler
var compiler = webpack(webpackConfig);

// console.log(webpackConfig);

// webpack dev server options
var devServerOptions = {
  contentBase: config.path.dist,
  hot: true,
  historyApiFallback: false,
  // noInfo: true,
  stats: {
    colors: true
  }
};
// proxy config
if (config.proxy) {
  devServerOptions.proxy = config.proxy;
}

// run
var server = new webpackDevServer(compiler, devServerOptions);

server.listen(PORT, () => {
  console.log(`[${chalk.green('INFO')}] Server run at ${chalk.yellow.underline('http://127.0.0.1:' + PORT)}`);
});

