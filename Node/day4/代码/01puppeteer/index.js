const puppeteer = require('puppeteer');

async function test() {
  // puppeteer.launch实例开启浏览器，
  // 可以传入一个options对象，可以配置为无界面浏览器，也可以配置为有界面浏览器
  // 无界面浏览器性能更高更快，有界面一般用于调试开启
  let options = {
    // 设置视窗的宽高
    defaultViewport: {
      width: 1400,
      height: 800
    },
    // 设置为有界面，如果为true，即为无界面
    headless: false
  }
  const browser = await puppeteer.launch(options)
  // 打开新页面
  let page = await browser.newPage()
  // 访问页面
  await page.goto('https://www.dytt8.net/index.htm');
  // 截屏
  // await page.screenshot({ path: 'screenshot.png' });
  // 获取页面内容
  // $$eval函数使得我们的回调函数可以运行在浏览器中，并且可以通过浏览器的方式进行输出
  let elements = await page.$$eval('#menu li a', (elements) => {
    // console.log(elements)
    // 创建一个数组去收集元素的信息，这里我们需要收集地址和内容
    let eles = []
    elements.forEach((item, i) => {
      // console.log(item.innerText)
      let href = item.getAttribute('href')
      if (href !== '#') {
        let eleObj = {
          href,
          text:item.innerText
        }
        eles.push(eleObj)
        //  console.log(eleObj)
      }
     
    });

    return eles;
  })
  // 浏览器的内容可以监听控制台的输出
  // page.on('console', (eventMsg) => {
  //   console.log(eventMsg.text())
  // })
  // 打开国内的页面
  let gnPage = await browser.newPage()
  await gnPage.goto(elements[2].href)
  console.log(elements)
}

test()
