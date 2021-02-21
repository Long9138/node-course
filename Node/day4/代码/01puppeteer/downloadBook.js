let puppeteer = require('puppeteer');
let axios = require('axios');
let fs = require('fs');
let { fsRead, fsWrite } = require('./johnnyFs');

(async function () {
  let debugOptions = {
    // 设置视窗的宽高
    defaultViewport: {
      width: 1400,
      height: 800
    },
    // 设置为有界面，如果为true，即为无界面
    headless: false,
    // 设置放慢每个步骤的毫秒数
    // slowMo: 250
  };
  let options = { headless: true };
  let browser = await puppeteer.launch(debugOptions);
  let index = 0

  // 将延迟函数封装成promise对象
  async function wait(milliSeconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('成功执行延迟函数，延迟：' + milliSeconds)
      }, milliSeconds);
    })
  }

  // 解析book.json文件
  async function parseTxt() {
    // 读取电子书信息
    let bookArr = await fsRead('book.json')
    // 解析
    bookArr = JSON.parse(bookArr)

    return bookArr;
  }

  let bookArr = await parseTxt()

  async function downloadBook() {
    // 根据索引值下载书
    if (index == bookArr.length) {
      return '完成';
    }
    let bookObj = bookArr[index];
    index++;
    // 打开新页面下载书籍
    let page = await browser.newPage();
    await page.goto(bookObj.href);
    // 因为a链接时js渲染出来的内容，并不是页面请求回来就有的内容，而是js通过ajax访问后台之后获取链接地址才有的内容
    await page.waitForSelector('#table_files tbody', { visible: true });
    // 获取a链接对象
    let elementsAherf = await page.$$eval('#table_files tbody a', (elements) => {
      let url = ''
      if (!elements.length) return url
      elements.forEach((element, i) => {
        if ((element.innerText).indexOf('.epub') !== -1) {
          return url = elements[i].href
        }
      });
      return url
    })
    if (elementsAherf) {
      bookLinkPage(elementsAherf, bookObj.title)
      page.close()
    } else {
      page.close()
      downloadBook()
    }
  };

  async function bookLinkPage(linkUrl, title) {
    let page = await browser.newPage();
    // 截取谷歌请求
    await page.setRequestInterception(true);
    // 监听请求事件，并对请求进行拦截
    page.on('request', interceptedRequest => {
      // 通过URL模块对请求的地址进行解析
      let urlObj = new URL(interceptedRequest.url())
      if (urlObj.hostname === '167-ctc-dd.tv002.com') {
        // 如果是谷歌的广告请求，那么就放弃当次请求，因为谷歌广告响应太慢
        console.log('截获地址')
        console.log(urlObj.href)
        interceptedRequest.abort()
        let ws = fs.createWriteStream('./book/' + title + '.epub')
        axios.get(urlObj.href, { responseType: 'stream' }).then((res) => {
          res.data.pipe(ws)
          ws.on('close', () => {
            console.log('下载已完成：', title)
            // 下完一本再下另外一本
            downloadBook()
            page.close()
          })
        })
      } else {
        interceptedRequest.continue()
      }
    });

    await page.goto(linkUrl)
    await page.waitForSelector('.btn.btn-outline-secondary.fs--1');
    let btn = await page.$('.btn.btn-outline-secondary.fs--1')
    if (btn) {
      await btn.click()
    }
  }

  downloadBook()
})();