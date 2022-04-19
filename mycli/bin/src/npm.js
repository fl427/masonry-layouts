// 处理下载依赖，启动项目操作
const which = require('which');

// 找到npm
const findNpm = () => {
    const npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm'];
    for (let i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i]);
            console.log('use npm: ' + npms[i]);
            return npms[i];
        } catch {

        }
    }
    throw new Error('please install npm');
}

// 运行终端命令
const runCmd = (cmd, args = [], fn) => {
    const runner = require('child_process').spawn(cmd, args, {
        stdio: 'inherit' // 子进程的标准输入输出配置 通过相应的标准输入输出流传入/传出父进程。 在前三个位置，这分别相当于 process.stdin、process.stdout 和 process.stderr。 在任何其他位置，相当于 'ignore'。
    });
    runner.on('close', (code) => {
        if (fn) {
            fn(code);
        }
    })
};

module.exports = function (installArg = ['install']) {
    // 闭包保存npm
    const npm = findNpm();
    return function (done) {
        // 执行命令
        runCmd(which.sync(npm), installArg, function () {
            // 执行成功回调
            done && done();
        })
    }
}