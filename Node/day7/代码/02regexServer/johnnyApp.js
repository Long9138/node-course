let http = require('http');
let path = require('path');
let fs = require('fs');

class johnnyApp {
  constructor(obj) {
    this.server = http.createServer()
    this.reqEvent = {}
    this.staticDir = '/static'
    this.server.on('request', (req, res) => {
      // 解析路径
      let pathObj = path.parse(req.url)
      req.pathObj = pathObj
      res.render = render
      // 循环匹配正则路径
      for (let key in this.reqEvent) {
        let regStr = key
        let reg = new RegExp(regStr, 'igs')
        // console.log(regStr,reg)
        if (reg.test(req.url)) {
          res.setHeader("content-type", "text/html;charset=utf-8")
          this.reqEvent[key](req, res)
          return;
        }
      }
      try {
        if (pathObj.dir === this.staticDir) {
          // 根据请求的后缀名，返回文件的类型
          res.setHeader("content-type", this.getContentType(pathObj.ext))
          // 从服务器磁盘中读取文件，并输出到响应对象中
          let rs = fs.createReadStream('./static/' + pathObj.base)
          rs.pipe(res)
        } else {
          res.setHeader("content-type", "text/html;charset=utf-8")
          res.end("<h1>404!页面资源找不到</h1>")
        }
      } catch (error) {
        console.log(error)
        res.end(`<h1>500!${error}</h1>`)
      }
    })
  }
  on(url, fn) {
    this.reqEvent[url] = fn;
  }
  run(port, callback) {
    this.server.listen(port, callback)
  }
  // 根据后缀名返回文件类型
  getContentType(extName) {
    switch (extName) {
      case ".jpg":
      case ".png":
        return "image/jpeg";
      case ".html":
        return "text/html;charset=utf-8";
      case ".js":
        return "text/javascript;charset=utf-8";
      case ".json":
        return "text/json;charset=utf-8";
      case ".gif":
        return "image/gif";
      case ".svg":
        return "image/svg+xml";
      case ".css":
        return "text/css";
      default:
        return '';
    }
  }
}
function render(options, path) {
  fs.readFile(path, { encoding: 'utf-8', flag: 'r' }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      try {
        // 数组变量的替换
        data = replaceArr(data, options)
        // 单个变量的替换
        data = replaceVar(data, options)
      } catch (error) {
        console.log(error)
      }
      // 最终输出渲染出来的HTML
      this.end(data)
    }

  })
}

function replaceVar(data, options) {
  console.log(data,'---data')
  let reg = /\{\{(.*?)\}\}/igs
  let result;
  while (result = reg.exec(data)) {
    console.log(result,'---------result')
    // 去除2边的空白
    let strKey = result[1].trim()
    console.log(strKey,'---------strKey')
    let strValue = eval('options.' + strKey)
    // console.log(strValue)
    data = data.replace(result[0], strValue)
  }
  return data
}

function replaceArr(data, options) {
  // 匹配循环的变量，并且替换循环的内容
  let reg = /\{\%for \{(.*?)\} \%\}(.*?)\{\%endfor\%\}/igs
  while (result = reg.exec(data)) {
    let strKey = result[1].trim();
    // 通过KEY值获取数组内容
    let strValueArr = options[strKey]
    let listStr = ''
    strValueArr.forEach((item, i) => {
      // 替换每一项内容里的变量
      listStr = listStr + replaceVar(result[2], { item })
    });

    data = data.replace(result[0], listStr)
  }
  return data
}

module.exports = johnnyApp;