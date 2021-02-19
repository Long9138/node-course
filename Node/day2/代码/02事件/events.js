// 引入 events 模块
const events = require('events');
const fs = require('fs');
// 创建 eventEmitter 对象
let ee = new events.EventEmitter();

// 绑定事件处理程序
ee.on('helloSuccess', function (eventMsg) {
  console.log('1吃夜宵')
  console.log(eventMsg)
})
ee.on('helloSuccess', function () {
  console.log('2唱K')
})
ee.on('helloSuccess', function () {
  console.log('3打王者')
})
ee.on('helloSuccess', function () {
  console.log('4打Dota')
})

function johnnyReadFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, data) {
      if (err) {
        // console.log(err)
        reject(err)
      } else {
        // console.log(data)
        resolve(data)
      }
    })
  })
}

// 异步触发绑定事件
// 1写法
johnnyReadFile('hello2.txt').then(res => ee.emit('helloSuccess', res))
// 2写法
async function test() {
  let data = await johnnyReadFile('hello2.txt')
  ee.emit('helloSuccess', data)
}
test()

