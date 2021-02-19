const fs = require('fs');
function fsRead(path) {
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

function fsWrite(path, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, content, { flag: 'a', encoding: 'utf-8' }, function (err) {
      if (err) {
        // console.log('写入内容出错')
        reject(err)
      } else {
        // console.log('写入内容成功')
        resolve(err)
      }
    })
  })
}

module.exports = { fsRead, fsWrite }