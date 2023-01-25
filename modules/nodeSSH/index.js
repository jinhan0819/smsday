let config = require('../../config');
let { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
let fs = require('fs');

module.exports = {
    // 리눅스 command 실행 후 callback
    execRunCallback: async function (command, callback) {
        await ssh.connect(config.ssh_config).then(async () => {
            await ssh.execCommand(command, {}).then(async function (result) {
                callback(result)
            })
        })
    },
    // 리눅스 command 실행 후 return
    execRunReturn: async function (command) {
        await ssh.connect(config.ssh_config).then(async () => {
            await ssh.execCommand(command, {}).then(async function (result) {
                return result;
            })
        })
    },
    // 리눅스 연결 파일및 폴더생성후 callback
    mkRunCallback: async function (route, type, callback) {
        if (process.env.NODE_ENV == 'development') {

            ssh.connect(config.ssh_config).then(() => {
                let command = ``;
                if (type == 'file') {
                    command = `touch ` + config.ssh_project_dir + route;
                } else if (type == 'dir') {
                    command = `mkdir ` + config.ssh_project_dir + route;
                }
                ssh.execCommand(command, {}).then(function (result) {
                    callback(result)
                })
            })
        } else {
            if (type == 'file') {
                fs.writeFile(config.ssh_project_dir + route, '', function (err) {

                    if (err === null) {
                        console.log('make project file success');
                        callback('success')
                    } else {
                        console.log('make project file fail ');
                        callback('fail')
                    }
                });
            } else if (type == 'dir') {

                fs.mkdir(config.ssh_project_dir + route, (err) => {
                    if (err === null) {
                        console.log('make project dir success');
                        callback('success')
                    } else {
                        console.log('make project dir fail ');
                        callback('fail')
                    }

                });
            }



        }

    },
    // 파일 및 폴더 삭제
    deleteForlder: async function (route, type, callback) {
        if (process.env.NODE_ENV == 'development') {

            ssh.connect(config.ssh_config).then(() => {
                let command = ``;
                    command = `rm -rf ` + config.ssh_project_dir + route;
                    console.log(command);                
                ssh.execCommand(command, {}).then(function (result) {
                    callback(result)
                })
            })

        } else {
            
            var deleteFolderRecursive = function () {
                // existsSync: 파일이나 폴더가 존재하는 파악
                var path = config.ssh_project_dir + route;

                if (fs.existsSync(path)) {
                    // readdirSync(path): 디렉토리 안의 파일의 이름을 배열로 반환
    
                    fs.readdirSync(path).forEach(function (file, index) {
                        var curPath = path + "/" + file;
                        if (fs.lstatSync(curPath).isDirectory()) { // lstatSync: stat값을 반환함, isDirectory(): 디렉토리인지 파악
                            deleteFolderRecursive(curPath);          // 재귀(reCurse)
                        } else {                                              // delete file
                            fs.unlinkSync(curPath);                     // unlinkSync: 파일 삭제
                        }
                    });
                    fs.rmdirSync(path);                              // rmdirSync: 폴더 삭제
                    callback('complete - delete')
                }
            };
        }
    },

     // 파일 및 폴더 명 변경
    modifyForlderOrFileName: async function (route , p_route, type, modify_name, callback) {
        if (process.env.NODE_ENV == 'development') {
            ssh.connect(config.ssh_config).then(() => {
                let command = ``;
                    command = `mv ` + config.ssh_project_dir + route + ' ' + config.ssh_project_dir + p_route + modify_name;
                    console.log(command);                
                ssh.execCommand(command, {}).then(function (result) {
                    callback(result)
                })
            })

        } else {
            fs.rename(config.ssh_project_dir + route, config.ssh_project_dir + p_route + modify_name, (err) => {
                if (err) throw err;
                console.log();
                callback('complete - rename');
                });
            
        }
    },
};

