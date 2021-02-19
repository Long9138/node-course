let readline = require('readline');
let { fsWrite } = require('./johnnyFs');
// 导入readline包
// 实例化接口对象
let r1 = readline.createInterface({
  output: process.stdout,
  input: process.stdin
})

// 设置r1，提问事件
// r1.question('今晚吃啥？', function (answer) {
//   console.log('答复：', answer)
//   r1.close()
// })

function johnnyQuestion(title) {
  return new Promise(function (resolve, reject) {
    r1.question(title, function (answer) {
      resolve(answer)
    })
  })
}

async function createPackage() {
  let name = await johnnyQuestion('您的包名叫什么？');
  let description = await johnnyQuestion('您的包如何描述？');
  let main = await johnnyQuestion('您的包主程序入口文件是什么？');
  let author = await johnnyQuestion('您的包的作者是谁？');

  let content = `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "${description}",
    "main": "${main}",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "keywords": [
      "JOHNNY"
    ],
    "author": "${author}",
    "license": "ISC"
  }`
  await fsWrite('package.json', content)
  // 最终写完内容，关闭输入进程
  r1.close()
}
createPackage()


r1.on('close', function () {
  process.exit(0)
})