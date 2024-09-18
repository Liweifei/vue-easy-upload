const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  lintOnSave: false,
  devServer: {//webpack4+应该是这样配置的
    client: {
      overlay: false
    }
  },
  parallel:false,//解决worker打包模块冲突问题
  productionSourceMap:false,
  filenameHashing: false,//关了此还有一个作用就是减少了打包体积
  css: {
    extract: false
  },
  // configureWebpack: {
  //   output: {
  //     filename: 'js/[name].[contenthash].js',
  //     chunkFilename: 'js/[name].[contenthash].js'
  //   },
  // },
  // transpileDependencies: true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // config.optimization.minimize = false;
      config.optimization.splitChunks = false;
      config.entry = './lib/index.js'
      config.output.filename = 'vue-easy-upload.js'
      config.output.libraryTarget = 'umd'//libraryTarget:“umd”，该方案支持commonjs、commonjs2、amd，可以在浏览器、node中通用。
    }

  },
  chainWebpack: config => {
    // 下面是删除打包html的配置，只需js即可
    config.module
      .rule('worker')
			.test(/\.worker\.js$/)
			.use('worker-loader')
			.loader('worker-loader')
      .options({
        inline: 'no-fallback', // 将 worker 内联到主文件中
        // esModule: false, 
      })
      .end();
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_debugger = true
        options[0].terserOptions.compress.drop_console = true
        return options
      })
      config.plugins.delete('html')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      config.plugins.delete('copy')
    }
  }
})
