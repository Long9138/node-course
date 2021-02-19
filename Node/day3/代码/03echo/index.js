const axios = require('axios');
const fs = require('fs');
const path = require('path');


// 目标：下载音乐
// 1获取音乐相关的信息，通过音乐相关的信息获取mp3地址
// 2如何获取大量的音乐信息，通过获取音乐列表
// 3通过音乐的分类页，获取音乐列表

async function wait(milliseconds) {
  return new Promise((resovle, reject) => {
    setTimeout(() => {
      resovle()
    }, milliseconds);
  })
}

async function spider() {
  for (let i = 1; i <= 20; i++) {
    await wait(2000)
    getPage(i)
  }
}

async function getPage(num) {
  let httpUrl = 'http://www.app-echo.com/api/recommend/sound-day?page=' + num
  let res = await axios.get(httpUrl);
  // console.log(res.data.list)
  let list = res.data.list
  list.forEach((item, i) => {
    let title = item.sound.name
    let mp3Url = item.sound.source
    let fileName = path.parse(mp3Url).name

    let content = `${title},${mp3Url},${fileName}\n`
    fs.writeFile('music.txt', content, { flag: 'a' }, () => {
      console.log('写入完成：' + title)
    })
    // console.log(fileName)
    // console.log(mp3Url)
    download(mp3Url, title)
  });
}

async function download(mp3Url, title) {
  let res = await axios.get(mp3Url, { responseType: 'stream' })
  let ws = fs.createWriteStream(`./mp3/${title}.mp3`);
  res.data.pipe(ws)
  res.data.on('close', () => {
    ws.close()
  })
}

spider()
// getPage(1)