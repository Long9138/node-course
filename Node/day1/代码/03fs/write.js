const fs = require('fs');
// wirte =>w       read =>r       append =>a
// fs.writeFile('test.txt', 'ssd', { flag: 'a', encoding: 'utf-8' }, function (err) {
//   if (err) console.log('写入内容出错')
//   else console.log('写入内容成功')
// })

function writefs(path, content) {
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

// async function writeList () {
//   await writefs('zyl.txt','1今天吃烧烤\n')
//   await writefs('zyl.txt','2今天吃烧烤\n')
//   await writefs('zyl.txt','3今天吃烧烤\n')
//   await writefs('zyl.txt','4今天吃烧烤\n')
// }

async function writeList () {
  await writefs('zyl.html','<h1>1今天吃烧烤</h1>')
  await writefs('zyl.html','<h1>2今天吃烧烤</h1>')
  await writefs('zyl.html','<h1>3今天吃烧烤</h1>')
  await writefs('zyl.html','<h1>4今天吃烧烤</h1>')
}

writeList()