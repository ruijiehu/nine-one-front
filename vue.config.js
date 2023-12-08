const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const CompressionPlugin = require('compression-webpack-plugin')
const fs = require('fs')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const MYPLUGIN = 'addWebpackConfigToDynamicImport'
class AddWebpackConfigToDynamicImport {
  apply(compiler) {
    compiler.hooks.environment.tap(MYPLUGIN, () => {
      addWebpackConfigToDynamicImport()
    })
    compiler.hooks.done.tap(MYPLUGIN, () => {
      addWebpackConfigToDynamicImport(true)
    })
  }
}
function addWebpackConfigToDynamicImport(reverse) {
  let str1 = 'webpackExclude__'; let str2 = 'webpackExclude'
  if (reverse) {
    const temp = str1
    str1 = str2
    str2 = temp
  }
  const path = resolve('./src/store/modules/permission.js')
  let res = fs.readFileSync(path).toString('utf-8')
  res = res.replace(str1, str2)
  fs.writeFileSync(path, res)
}

const name = process.env.VUE_APP_TITLE || '玖易贸易订单管理系统' // 网页标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口
// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档

const plugins = [
  // new BundleAnalyzerPlugin()
]
/** 只有使用命令 build-prod的时候才会加载这个插件 */
if (process.env.NODE_RUNNING == 'production') {
  plugins.push(new AddWebpackConfigToDynamicImport())
}
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  // lintOnSave: process.env.NODE_ENV === "development",
  lintOnSave: true,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://192.168.1.136:7820/nine-one`,
        target: `http://192.168.9.95:7820/nine-one`,
        // target: `http://192.168.8.30:7820/nine-one`,
        // target: `http://localhost:7820/nine-one`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          // quill: {
          //   name: 'chunk-quill',
          //   priority: 40,
          //   test: /[\\/]node_modules[\\/]_?quill(.*)/
          // },
          // echarts: {
          //   name: 'chunk-echarts',
          //   priority: 20,
          //   test: /[\\/]node_modules[\\/]_?echarts(.*)/
          // },
          // brace: {
          //   name: 'chunk-brace',
          //   priority: 20,
          //   test: /[\\/]node_modules[\\/]_?brace(.*)/
          // },
          lodash: {
            name: 'lodash',
            test: resolve('node_modules/lodash/lodash.js'),
            priority: 20
          },

          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          },
          jxMapJson: {
            name: 'jxmap',
            test: resolve('src/views/chartsGenerator'),
            priority: 20
          },
          codemirror: {
            name: 'codemirror',
            test: resolve('src/utils/codemirror/codemirror.min.js'),
            priority: 20
          },

          tableGenerator: {
            name: 'tableGenerator',
            test: resolve('src/views/tableGenerator'),
            priority: 20
          }
        }
      })
      config.optimization.runtimeChunk('single'),
      {
        from: path.resolve(__dirname, './public/robots.txt'), // 防爬虫文件
        to: './' // 到根目录下
      }
    })
  },
  runtimeCompiler: true
}
