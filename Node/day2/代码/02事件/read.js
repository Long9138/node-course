const fs = require('fs');

fs.readFile('hello.txt', { flag: 'r', encoding: 'utf-8' }, function (error, data) {
  if (error) {
    console.log(error)
  } else {
    console.log(data)
    johnnyEvent.emit('helloSuccess', data)
    // 1数据库查看所有的用户详细信息
    // 2统计年龄比例
    // 3查看所有用户学校的详细信息
  }
})

let johnnyEvent = {
  events: {
    // helloSuccess:[fn,fn,fn]
  },
  on: function (eventName, eventFn) {
    if (this.events[eventName]) {
      this.events[eventName].push(eventFn)
    } else {
      this.events[eventName] = [eventFn]
    }
  },
  emit: function (eventName, eventMsg) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(itemFn => {
        itemFn(eventMsg)
      });
    }
  }
}

johnnyEvent.on('helloSuccess', function (eventMsg) {
  console.log('1数据库查看所有的用户详细信息')
})

johnnyEvent.on('helloSuccess', function (eventMsg) {
  console.log('2统计=用户年龄比例')
})

johnnyEvent.on('helloSuccess', function (eventMsg) {
  console.log('3查看所有用户学校的详细信息')
})
