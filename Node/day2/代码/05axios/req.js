let axios = require('axios');
const fs = require('fs');
let { fsRead, fsWrite, fsDir, fsStat } = require('./johnnyFs');
let httpUrl = 'https://www.1905.com/vod/list/n_1_t_1/o3p1.html'

function req(url) {
  return new Promise((resovle, reject) => {
    axios.get(url).then(res => {
      // console.log(res)
      resovle(res.data)
      console.log(url, '----------req resovle')
    }).catch(rej => {
      reject(rej)
      console.log(rej, '------------rej')
    })
  })
}


// 获取起始页面的所有分类
async function getClassUrl() {

  let data = await req(httpUrl)
  // console.log(res)
  let reg = /<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs
  // 解析html内容
  let result = reg.exec(data)[1]
  let reg1 = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;".*?>(.*?)<\/a>/igs
  let arrClass = []
  let res;
  while (res = reg1.exec(result)) {
    if (res[2] != '全部') {
      let obj = {
        className: res[2],
        url: res[1]
      }
      arrClass.push(obj)
      await getPage(res[1], res[2])
    }
  }
  // console.log(arrClass)
}

// 获取分类分页信息
async function getPage(url, moviesType) {
  console.log(url, moviesType, '----------------getPage')
  let data = await req(url)
  let reg = /<p class="search-nav-mark.*?<\/p>/igs;
  let reg2 = /<q class="f14">(.*?)<\/q>/igs;
  let total; // 分类总影片数
  let page; // 分类页数
  let result = reg.exec(data);
  total = reg2.exec(result)[1]
  // 根据一个页面最多24部影片计算页数
  page = total > 24 ? Math.ceil(total / 24) : 1
  for (let i = 0; i < page; i++) {
    let repUrl = url.replace('o3p1', `o3p${i + 1}`)
    // 判断不存在分页目录进行创建
    let exist = await fsStat(`./movies/${moviesType}/第${i + 1}页`)
    if (!exist) await fsDir(`./movies/${moviesType}/第${i + 1}页`)
    await getMovies(repUrl, moviesType, `第${i + 1}页`)
  }
}


// 获取分类里的电影链接
async function getMovies(url, moviesType, page) {
  console.log(url, moviesType, page, '------------getMovies')
  let data = await req(url)
  let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)".*?><img/igs;
  let res;
  let arrList = [];
  while (res = reg.exec(data)) {
    // 改进，可以改为迭代器，提升性能
    arrList.push(res[1])
    await parsePage(res[1], moviesType, page)
  }
  // console.log(arrList)
}

// 根据电影链接获取电影的详细信息
async function parsePage(url, moviesType, page) {
  console.log(url, moviesType, page, '----------------parsePage')
  let data = await req(url)
  let reg = /<h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1>.*?id="playerBoxIntroCon">(.*?)/igs
  let res;
  while (res = reg.exec(data)) {
    let movie = {
      name: res[1],
      // brief: res[2],
      // director: res[3],
      moiveUrl: url,
      moviesType
    }
    let path = `./movies/${moviesType}/${page}/${res[1]}.json`
    let strMovie = JSON.stringify(movie)
    console.log(res[1], page)

    let exist = await fsStat(path)
    if (!exist) fsWrite(path, strMovie)
  }
}

getClassUrl()