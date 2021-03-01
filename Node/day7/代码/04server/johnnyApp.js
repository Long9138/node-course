let http = require('http');
let path = require('path');
let fs = require('fs');

class johnnyApp {
  constructor(obj) {
    this.server = http.createServer()
    this.reqEvent = {}
    this.staticDir = '/static'
    this.dynamicList = [] // 动态接口列表
    this.server.on('request', (req, res) => {
      // 解析路径
      let pathObj = path.parse(req.url)
      let dir = pathObj.dir + pathObj.name
      // console.log(pathObj, '---pathObj')
      // console.log(dir, '----dir')
      if (this.dynamicList.indexOf(pathObj.dir) > -1) {
        res.render = render
        res.setHeader("content-type", "text/html;charset=utf-8")
        req.pathObj = pathObj
        this.reqEvent[pathObj.dir](req, res)
      } else if (this.dynamicList.indexOf(dir) > -1) {
        this.page404InfoFn(res)
      } else if (dir in this.reqEvent) {
        res.setHeader("content-type", "text/html;charset=utf-8")
        req.pathObj = pathObj
        this.reqEvent[dir](req, res)
      } else if (pathObj.dir === this.staticDir) {
        // 根据请求的后缀名，返回文件的类型
        let contentType = this.getContentType(pathObj.ext)
        if (!contentType) {
          this.page404InfoFn(res)
          return
        }
        // 判断文件是否存在
        fs.stat('./static/', (err, stats) => {
          if (stats) {
            res.setHeader("content-type", this.getContentType(pathObj.ext))
            // 从服务器磁盘中读取文件，并输出到响应对象中
            let rs = fs.createReadStream('./static/' + pathObj.base)
            rs.pipe(res)
          } else {
            this.page404InfoFn(res)
          }
        })

      } else {
        this.page404InfoFn(res)
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
  // 返回404信息
  page404InfoFn(res) {
    res.setHeader("content-type", "text/html;charset=utf-8")
    res.end("<h1>404!页面资源找不到</h1>")
  }

}
function render(options, path) {
  fs.readFile(path, { encoding: 'utf-8', flag: 'r' }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      data = replaceArr(data, options)
      data = replaceVar(data, options)

      this.end(data)
    }

  })
}

function replaceVar(data, options) {
  let reg = /\{\{(.*?)\}\}/igs
  let result;
  while (result = reg.exec(data)) {
    // 去除2边的空白
    let strKey = result[1].trim()
    let strValue = eval('options.' + strKey)
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