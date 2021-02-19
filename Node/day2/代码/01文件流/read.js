const fs = require('fs');

// 创建读取流，语法:fs.createReadStream(路径，【可选的配置项】)
// let rs = fs.createReadStream('hello.txt', { flags: 'r', encoding: 'utf-8' });
let rs = fs.createReadStream('video.avi', { flags: 'r' });

let ws = fs.createWriteStream('a.mp4', { flags: 'w' })
// console.log(rs)

rs.on('open', function () {
  console.log('读取的文件已打开')
})

rs.on('close', function () {
  console.log('读取流结束')
  // 读取流结束后，关闭文件写入
  ws.end()
})
// 每一批数据流入完成
rs.on('data', function (chunk) {
  console.log('单批数据流入:' + chunk.length)
  console.log(chunk)
  ws.write(chunk, () => { console.log('单批数据流入完成') })
})

