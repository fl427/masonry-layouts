#!/usr/bin/env node
// 指定脚本的解释程序, 通过/usr/bin/env 运行程序
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const colors = require('../utils/colors');
const question = require('../utils/questions');

const create = require('../src/create');
const start = require('../src/start');

// mycli create 创建项目
program
    .command('create')  // 添加自定义命令
    .description('create a project')
    .action(() => { // 命令后的参数传入action的回调以及program.args数据中  
        colors['green']('fl427 welcome to mycli, let\'s create react-ts project');
        inquirer.prompt(question).then(answer => {
            console.log('answer=', answer);
            if (answer.conf) {
                // 代表用户选择了建立项目（看一下我们的question选项
                // 因此执行create.js中的代码：复制template模板文件
                create(answer);
            }
        })
    })

// mycli start 运行项目
program
    .command('start')
    .description('start a project')
    .action(() => {
        colors['green']('------Start Project运行项目------');
        // 运行项目
        start('start').then(() => {
            colors['green']('----运行完成----')
        })
    })

// mycli build 打包项目
program
    .command('build')
    .description('build a project')
    .action(() => {
        colors['green']('------Build Project构建项目------');
        // 打包项目
        start('build').then(() => {
            colors['green']('----构建完成----')
        })
    })

program.parse(process.argv); // process为内置模块，process.argv是node外露的api
