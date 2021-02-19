let url = require('url');
// console.log(url)

let httpUrl = 'https://sale.vmall.com/mate.html?cid=10602'
let urlObj = new URL(httpUrl)
console.log(urlObj)

let targetUrl = 'http://www.taobao.com/'
httpUrl = './sxt/qianduan/johnny.html'

// let newUrl = url.resolve(targetUrl,httpUrl)
// console.log(newUrl)
console.log(new URL(targetUrl,httpUrl))