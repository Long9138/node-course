const fs = require('fs');

// 创建读取流，语法:fs.createReadStream(路径，【可选的配置项】)
// let rs = fs.createReadStream('hello.txt', { flags: 'r', encoding: 'utf-8' });
let rs = fs.createReadStream('video.avi', { flags: 'r' });

let ws = fs.createWriteStream('b.mp4', { flags: 'w' })
// console.log(rs)

rs.on('open', function () {
  console.log('读取的文件已打开')
})

rs.on('close', function () {
  console.log('读取流结束')
})


rs.pipe(ws)

