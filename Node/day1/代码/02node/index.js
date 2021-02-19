let a = require('./index1')
// 1在没有任何内容导出去的情况下获取某个文件的内容，会得到一个空对象
// 2require获取文件路径时，可以不加后缀名，默认的后缀名就是js

// 仅在模块第一次被使用时执行一次
let b = require('./index1')
let $ = require('jquery')
console.log(a)
console.log(b)
console.log(a == b)
console.log($)
// console.log(a)