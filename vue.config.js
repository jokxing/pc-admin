const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';
const path = require("path");

let mode = process.env.NODE_ENV; //当前启动模式
 
const IS_PROD = ['production', 'prod'].includes(mode); //判断是否是生产模式
const NEED_MOCK = ['development', 'serve'].includes(mode);
const apiMock = require('mocker-api');
const resolve = (dir) => {
  return path.join(__dirname, dir);
}

const cdn = {
    css: [
        './css/element-ui.css'
    ],
    js: [
        './js/vue.min.js',
        './js/vue-router.min.js',
        './js/element-ui.js',
        './js/echarts.min.js',
    ]
}

// 本地环境是否需要使用cdn
const devNeedCdn = false

module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: (config) => {
        // 生产环境配置
        if (isProduction || devNeedCdn) {
            // 生产环境注入cdn
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = cdn;
                    return args;
                });
        }
        // 关于打包后包资源各部分占比的配置相关
        // config
        // .plugin('webpack-bundle-analyzer')
        // .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    },
    configureWebpack: (config) => {
        // 用cdn方式引入，则构建时要忽略相关资源
        if (isProduction || devNeedCdn) config.externals = cdn.externals;

        if (isProduction) {
            config.externals = {
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'element-ui': 'ElementUI',
                'echarts': 'echarts',
            },
            config.plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                }),
            );
        }
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    devServer: {
        overlay:{
            warning:false,
            errors:false
        },
        open: process.platform === 'darwin',
        host: 'www.a_admin.com',
        port: 80,
        https: false,
        hotOnly: false,
        proxy: '', 
        before(app){
            if (NEED_MOCK) {
              apiMock(app, resolve('./mock/index.js'))
            }
          }
    },
    // 第三方插件配置
    pluginOptions: {
    // ...
    }
}