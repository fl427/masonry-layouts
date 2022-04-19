const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base');

module.exports = merge(baseWebpackConfig, {
    // !important 加上这个就白屏 output和HtmlWebpackPlugin设置不当都会导致白屏
    // output: {
    //     publicPath: '/masonry-photo',
    // },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            // !important 加上这个就白屏
            // filename: 'index.html',
            template: './public/index.html',
            // chunks: ['index'],
        }),
    ],
    devServer: {
        host: 'localhost',
        hot: true,
        port: 3000,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/api': {
                target: "http://localhost:4000",
                changeOrigin: true,
            }
        }
    }
});