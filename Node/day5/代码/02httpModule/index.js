let http = require('http');
// http模块为内置模块，不需要安装依赖
// 创建server服务器对象
let server = http.createServer()
// 监听对当前服务器对象的请求
server.on('request', (req, res) => {
  // 当服务器被请求时，会触发请求事件，并传入请求对象和响应对象
  res.end('helloworld')
})

// 服务器监听的端口号
server.listen(3000, () => {
  // 启动监听端口号成功时触发
  console.log('服务器启动成功！')
})
