const fs = require('fs');

fs.rmdir('abc',function() {
  console.log('删除成功')
})