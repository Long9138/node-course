const axios = require('axios');

let httpUrl = 'https://www.doutula.com/article/detail/9002522';
let options = {
  proxy: {
    host: '171.13.202.99',
    port: 9999
  }
}
axios.get(httpUrl, options).then(res => {
  console.log(res.data)
}) 