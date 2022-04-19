// https://juejin.cn/post/6919308174151385096
const fs = require('fs');
const colors = require('../utils/colors');
const npm = require('./npm');

module.exports = (res) => {
    // 创建文件
    colors['green']('----开始创建文件------');
    // 获取template文件夹下的模板项目
    const sourcePath = __dirname.slice(0, -3) + 'template' // /Users/lufan/Documents/demo/mycli/template
    colors['blue']('当前路径:' + process.cwd());
    // 修改package.json
    revisePackageJson(res, sourcePath).then(() => {
        // todo: 接下来的npm()/runProject()应该都会在之后实现
        copy(sourcePath, process.cwd(), npm()); 
        console.log('成功')
    })
}

const revisePackageJson = (res, sourcePath) => {
    return new Promise((resolve) => {
        // 读取文件
        fs.readFile(sourcePath + '/package.json', (err, data) => {
            if (err) throw err;
            const { author, name } = res; // 记得我们写inquirer的时候，author, name就是用户的选择，我们这里传入的res就是inquirer接收到的answer
            // 替换模板
            let json = data.toString();
            json = json.replace(/demo-name/g, name.trim());
            json = json.replace(/demoAuthor/g, author.trim());
            const path = process.cwd() + '/package.json'  // process.cwd() 方法会返回 Node.js 进程的当前工作目录。
            // 写入文件
            fs.writeFile(path, Buffer.from(json), () => {
                colors['green']('创建文件：' + path);
                resolve();
            })
        })
    })
};

let fileCount = 0; 
let dirCount = 0;
let flat = 0; // readdir数量
// 这几个值是为了判定所有的文件是否都复制完成了

function copy (sourcePath, currentPath, cb) {
    flat++;
    // 读取文件夹下面的文件
    fs.readdir(sourcePath, (err, paths) => {
        flat--;
        if (err) {
            throw err;
        }
        paths.forEach(path => {
            if (path !== '.git' && path !== 'package.json') fileCount++; // .git文件不管，package.json之前特殊处理了
            const newSourcePath = sourcePath + '/' + path;
            const newCurrentPath = currentPath + '/' + path;  // 这两个地方就是为了把template中的文件原样复制到用户当前的文件夹中
            // 判断文件信息
            fs.stat(newSourcePath, (err, stat) => {
                if (err) {
                    throw err;
                }
                // 判断是文件，并且不是package.json
                if (stat.isFile() && path !== 'package.json') {
                    console.log('path::', path);
                    // 创建读写流
                    const readStream = fs.createReadStream(newSourcePath) // 复制大文件的时候一般用流来做
                    const writeStream = fs.createWriteStream(newCurrentPath);
                    readStream.pipe(writeStream);
                    colors['green']('创建文件：' + newCurrentPath);
                    fileCount--;
                    completeControl(cb);  // 这一步之后会实现
                } else if (stat.isDirectory()) {
                    console.log('这里？');
                    // 是文件夹，对文件夹进行dirExist操作
                    if (path !== '.git' && path !== 'package.json') {
                        dirCount++;
                        
                        dirExist(newSourcePath, newCurrentPath, copy, cb); // 这里递归调用了copy自己
                    }
                }
            })
        })
    })
}

function dirExist(sourcePath, currentPath, copyCallback, cb) {
    fs.access(currentPath, (ext => {
        console.log('ext', ext);
        if (ext === true) {
            // 递归调用copy函数
            copyCallback(sourcePath, currentPath, cb);
        } else {
            fs.mkdir(currentPath, () => {
                fileCount--;
                dirCount--;
                copyCallback(sourcePath, currentPath, cb);
                colors['yellow']('创建文件夹：'+ currentPath);
                completeControl(cb);
            })
        }
    }))
}

let isInstall = false;

function completeControl(cb){
    /* 三变量均为0，异步I/O执行完毕。 */
    if(fileCount === 0 && dirCount ===0 && flat===0){
        colors['green']('------构建完成-------')
        if(cb && !isInstall ){
            isInstall = true
            colors['blue']('-----开始install-----')
            cb(()=>{
                colors['blue']('-----完成install-----')
                /* 判断是否存在webpack  */
                runProject()
            })
        }
    }
}

function runProject(){
    try{
        /* 继续调用 npm 执行，npm start 命令 */
        const start = npm([ 'start' ])
        start()
    }catch(e){
       colors['red']('自动启动失败，请手动npm start 启动项目')
    }
} 


