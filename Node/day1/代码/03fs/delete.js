const fs = require('fs');
fs.unlink('zyl.html', function() {
  console.log('成功删除！')
})