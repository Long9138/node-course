let os = require('os');
console.log(os)
// 查看CPU信息
console.log(os.cpus())
// 查看整个内存大小
console.log(os.totalmem())
// 查看系统架构
console.log(os.arch())

// 查看剩余内存量
console.log(os.freemem())
// 查看系统平台
console.log(os.platform())