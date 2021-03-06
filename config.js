
var config = {
  devServer: {
    port: process.env.SERVER_PORT || 8000
  },
  proxy: {
    '/teacher/*': {
      target: 'http://192.168.70.212:5555',
      secure: false
    }
  },
  route: [ 'index', 'login' ],
  build: {
  }
};


var path = require('path');

Object.assign(config, {
  // env var: production | develop
  env: process.env.NODE_ENV || 'production',
  path: {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
    public: path.resolve(__dirname, 'public')
  }
});

config.isPro = config.env === 'production';
config.isDev = !config.isPro;

module.exports = exports = config;
