let mysql = require('mysql');
let axios = require('axios');
let cheerio = require('cheerio');

let page = 1;
let count = 300;
let options = {
  host: "localhost",
  // port: "3306", // 可选，默认是3306
  user: "root",
  password: "123456",
  database: "book"
}

let con = mysql.createConnection(options)
con.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("数据库连接成功")
  }
})

async function wait(milliSeconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功执行延迟函数，延迟：' + milliSeconds)
    }, milliSeconds);
  })
}

// 获取第N个页面所有书籍的链接
async function getPageUrl(num) {
  if (num === count) {
    console.log('已全部完成')
    return
  }
  let httpUrl = "https://sobooks.cc/page/" + num
  let res = await axios.get(httpUrl)
  // console.log(res.data)
  let $ = cheerio.load(res.data)
  aArr = $("#cardslist .card-item .thumb-img>a")
  aArr.each(async (i, element) => {
    let href = $(element).attr('href')
    console.log(href)

    await wait(100 * i)
    // 根据地址访问书籍详情页面
    let res = await getBookInfo(href)
    console.log(res)
    if (res)
      if (i === aArr.length - 1) {
        ++page
        console.log(page, '------------------page')
        getPageUrl(page)
      }
    // await getBookInfo(href).then((res) => {
    //   console.log(res)
    //   if (i === aArr.length - 1) {
    //     ++page
    //     console.log(page, '------------------page')
    //     getPageUrl(page)
    //   }
    // })

  })


}

async function getBookInfo(href) {
  let res = await axios.get(href);
  let $ = cheerio.load(res.data)
  // 书籍图片
  let bookimg = $(".article-content .bookpic>img").attr('src');
  // 书籍名称
  let bookname = $(".article-content .bookinfo li:nth-child(1)").text();
  bookname = bookname.substring(3, bookname.length)
  // 书籍作者
  let author = $(".article-content .bookinfo li:nth-child(2)").text();
  author = author.substring(3, author.length)
  // 书籍作者
  let tag = $(".article-content .bookinfo li:nth-child(4)").text();
  tag = tag.substring(3, tag.length)
  // 时间
  let pubtime = $(".article-content .bookinfo li:nth-child(5)").text();
  pubtime = pubtime.substring(3, pubtime.length)
  // 评分
  let score = $(".article-content .bookinfo li:nth-child(6) b").attr('class');
  score = score[score.length - 1]
  // 分类
  let cataory = $("#mute-category > a").text().trim();
  // 简介
  let brief = $(".article-content").html();
  let bookurl = href

  let arr = [bookname, author, tag, pubtime, score, bookimg, cataory, brief, bookurl]
  // console.log(arr)
  // 插入数据库
  let strSql = 'insert into book (bookname,author,tag,pubtime,score,bookimg,cataory,brief,bookurl) values (?,?,?,?,?,?,?,?,?)'

  return new Promise((resolve, reject) => {
    con.query(strSql, arr, (error, results) => {
      // console.log(error)
      // console.log(results)
      //  console.log(bookname)
      resolve(bookname)
    })
  })
}
getPageUrl(page)
// getBookInfo('https://sobooks.cc/books/17832.html')

