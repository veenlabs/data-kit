  /* craco.config.js */
  const webpack = require('webpack')
  const path = require('path')
  const pkg = require('./package.json')

  console.log('Cracko config......')

  const APP_VERSION = pkg.version

  const config = {
    isLocalHost : process.env.LOCALHOST === "yes"
  }
  
  const envs = new webpack.DefinePlugin({
    'process.env.APP_VERSION':JSON.stringify(APP_VERSION),
    // 'process.env': {
    //   'APP_VERSION':JSON.stringify(APP_VERSION),
    //   'BUILD_NUMBER':JSON.stringify((Date.now() + '').slice(-4)),
    //   'BUILD_TIME_STAMP':JSON.stringify(Date.now()),
    // }
  })

  module.exports = {
    webpack: {
      plugins: [envs],
      alias: {
        '@veenlabs/data-kit': path.resolve(__dirname, 'src/data-kit'),
      },
      configure: (webpackConfig, { env, paths }) => { 
        return webpackConfig;
       }
    },
  }