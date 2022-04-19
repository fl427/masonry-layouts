const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: './masonry-photo',
        filename: 'js/[name].[chunkname.5].js',
        chunkFilename: 'js/[name].[chunkname.5].js',
        globalObject: 'window',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            chunks: ['index'],
        })
    ]
})