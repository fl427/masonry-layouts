const path = require('path');
module.exports = {
    // 让Webpack知道以哪个模块为入口，进行依赖收集
    entry: './src/index.tsx',
    // 告诉Webpack打包好的文件放在哪里，以及如何命名
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:8].js',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.json', 'jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve('./src'),
        }
    },
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: "all"
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    'parmary-color': '#006AFF',
                                    'border-radius-base': '4px',
                                    'btn-border-radius': '4px',
                                    'btn-font-weight': '500',
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        name: 'img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.woff|woff2|eot|ttf|otf$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: '[name].[hash:6].[ext]',
                        limit: 50000,
                        esModule: false
                    }
                }]
            }
        ]
    },
    externals: process.env.NODE_ENV === 'production'
        ? {
            'react': 'react',
            'react-dom': 'react-dom',
            'react-router-dom': 'react-router-dom',
            'react-router': 'react-router',
        }
        : {}
}