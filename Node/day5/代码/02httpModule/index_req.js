let http = require('http');
// http模块为内置模块，不需要安装依赖
// 创建server服务器对象
let server = http.createServer()
// 监听对当前服务器对象的请求
server.on('request', (req, res) => {
  // 当服务器被请求时，会触发请求事件，并传入请求对象和响应对象
  console.log(req.url)
  // console.log(req.headers)
  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  // 根据路径信息，显示不同的页面内容
  if (req.url == '/') {
    res.end('<h1>首页</h1><img src="https://www.baidu.com/img/dong_8f1d47bcb77d74a1e029d8cbb3b33854.gif">')
  } else if (req.url == '/gnxw') {
    res.end('<h1>国内新闻</h1>')
  } else if (req.url == '/ylxw') {
    res.end('<h1>娱乐新闻</h1>')
  } else {
    res.end('<h1>404！页面找不到</h1>')
  }
  
})

// 服务器监听的端口号
server.listen(80, () => {
  // 启动监听端口号成功时触发
  console.log('服务器启动成功！')
})
