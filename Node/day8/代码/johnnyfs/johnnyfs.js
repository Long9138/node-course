const fs = require('fs');
function read(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, { flag: 'r', encoding: 'utf-8' }, function (err, data) {
      if (err) {
        // console.log(err)
        // 失败执行的内容
        reject(err)

      } else {
        // console.log(data)
        // 成功执行的内容
        resolve(data)
      }
      // console.log(456)
    })
  })
}

function write(path, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, content, { flag: 'a', encoding: 'utf-8' }, function (err) {
      if (err) {
        console.log('写入内容出错')
        reject(err)
      } else {
        console.log('写入内容成功')
        resolve(err)
      }
    })
  })
}

function mkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, { recursive: true }, function (err) {
      if (err) {
        reject(err)
        console.log('fsDir错误')
      } else {
        resolve('成功创建目录')
        console.log('成功创建目录:' + path)
      }
    })
  })
}

/**
 * 判断目录是否存在
 * @param path 路径
 * 
 * return Boolean
 */
function fsStat(path) {
  return new Promise(function (resolve, reject) {
    fs.stat(path, function (err, stats) {
      // if (err) {
      //   // console.log('错误')
      //   reject(false)
      // } else {
      //   console.log('已存在目录文件:'+path)
      //   resolve(true)
      // }
      resolve(err ? false : true)
    })
  })
}

function rename(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve("rename success")
      }
    })
  })
}

function readdir(path, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, options, (error, files) => {
      if (error) {
        reject(error)
      } else {
        resolve(files)
      }
    })
  })
}

module.exports = { read, readdir, write, rename, mkdir, fsStat }