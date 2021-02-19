const fs = require('fs');
// 导入文件模块
// node,读写文件也有同步和异步的接口


// 同步，等待和阻塞
// let content = fs.readFileSync('hello.txt', { flag: 'r', encoding: 'utf-8' })
// 异步
// fs.readFile('hello.txt', { flag: 'r', encoding: 'utf-8' }, function (err, data) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(data)
//   }
//   // console.log(456)
// })

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
      console.log(456)
    })
  })
}

// console.log(123)

// let w1 = fsRead('hello.txt')
// w1.then(res => { console.log(res) }).catch(rej => { console.log(rej) })

async function ReadList() {
  let file2 = await fsRead('hello.txt');
  let file3 = await fsRead(file2 + '.txt');
  let file3Content = await fsRead(file3 + '.txt');
  console.log(file3Content)
}

ReadList()

// console.log(content)