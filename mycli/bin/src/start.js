// 这里是为了和新建的mycli-webpack-plugin建立进程通信。
// 有两个进程，主进程mycli在mycli全局脚手架中，子进程是放在本地通过mycli create建立的react项目node_modules中
// 子进程用来管理webpack，合并webpack配置项，运行webpack-dev-serve
// 在start.js中启动子进程和mycli-webpack-plugin建立通信

'use strict';
// 启动项目
const child_process = require('child_process');
const chalk = require('chalk');
const fs = require('fs');

// 找到mycli-react-webpack-plugin的路径
const currentPath = process.cwd() + '/node_modules/mycli-react-webpack-plugin';

/**
 * 
 * @param {*} type type = start 本地启动项目 type = build 线上打包项目
 */
module.exports = (type) => {
    return new Promise((resolve, reject) => {
        // 判断 mycli-react-webpack-plugin 是否存在
        fs.exists(currentPath, (ext) => {
            if (ext) {
                // 存在，启动子进程
                const children = child_process.fork(currentPath + '/index.js');
                // 监听子进程信息
                children.on('message', (message) => {
                    const msg = JSON.parse(message);
                    if (msg.type === 'end') {
                        // 关闭子进程
                        children.kill();
                        resolve();
                    } else if (msg.type === 'error') {
                        // 关闭子进程
                        children.kill();
                        reject();
                    }
                })
                // 发送cwd路径 和操作类型 start 还是build
                children.send(JSON.stringify({
                    cwdPath: process.cwd(),
                    type: type || 'build'
                }))
            } else {
                // 不存在 抛出警告，下载
                console.log(chalk.red('mycli-react-webpack-plugin does not exist, please install'))
            }
        })
    })
}