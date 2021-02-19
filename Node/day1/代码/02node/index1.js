let a = 123;
let b = 456;
let c = 789;
let s1 = {username:'学生'}
console.log(s1,'s1')
// exports就是默认导出的对象
exports.a = a;
module.exports.c = c;
//系统默认设置了： exports = module.exports
// exports = {user:'小明'}
module.exports = s1

// 注意使用exports时，只能单个设置属性exports.a = a;
// 使用module.exports可以单个设置属性，也可以整个赋值