let axios = require('axios')
let mysql = require('mysql')
let cheerio = require('cheerio')
let parseNum = require('./parseNum')
let {write} = require("./lcfs")
let fs = require('fs')

let options = {
    host:"localhost",
    //port:"3306",//可选，默认式3306
    user:"root",
    password:"123456",
    database:"book"
}
//axios请求头的配置信息
let options2 = {
    headers:{
        "User-Agent":" Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
        "Cookie": "__mta=222114471.1574126937575.1575561742585.1575562035163.57; uuid_n_v=v1; uuid=F3A5F6E00A6B11EA866F9F7B8B645BB609807B37AECE45E69BBA4F3E5FC94038; _lxsdk_cuid=16e8146e542c8-04aa42a59aa0e4-5373e62-1fa400-16e8146e542c8; _lxsdk=F3A5F6E00A6B11EA866F9F7B8B645BB609807B37AECE45E69BBA4F3E5FC94038; _csrf=e7d0bd2ca9710f6294df933a1ea8d7546b48f8ed7a44f83a25177dd5f96233d0; Hm_lvt_703e94591e87be68cc8da0da7cbd0be2=1575507926,1575509335,1575525980,1575537558; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; __mta=222114471.1574126937575.1575537635171.1575537840771.39; Hm_lpvt_703e94591e87be68cc8da0da7cbd0be2=1575562035; _lxsdk_s=16ed6c2213d-710-b40-6ad%7C%7C12",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection":"keep-alive",
        "Host": "maoyan.com",
        "Pragma": "no-cache",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Referer": "https://maoyan.com/films?showType=3"
    }
}
//创建与数据库的连接的对象
let con = mysql.createConnection(options);

//建立连接
con.connect((err)=>{
    //如果建立连接失败
    if(err){
        console.log(err)
    }else{
        console.log('数据库连接成功')
    }
})

let index = 0;
let k = 0;
let hrefList = []
async function getPageList(index){
    let httpUrl = "https://maoyan.com/films?showType=3&offset="+ index*30;
    let response = await axios.get(httpUrl,options2)
    //console.log(response.data)
    let $ = cheerio.load(response.data);
    
    $(".movie-list .movie-item>a").each(function(i,element){
        let href = "https://maoyan.com"+$(element).attr('href')
        //console.log($(element).attr('href'))
        //"https://maoyan.com/films/1250952"
        hrefList.push(href);
    })
    
    //console.log(hrefList)
    getMovieInfo(hrefList[k])
    
}

getPageList(index);
//获取电影的详细信息
async function getMovieInfo(href){
    console.log(href)
    let response = await axios.get(href,options2)
    //console.log(response.data)
    let $ = cheerio.load(response.data)
    let moviename = $('.movie-brief-container .name').text();
    let movieimg = $('.avatar-shadow>.avatar').attr('src');
    let cataory = $('body > div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(1)').text();
    let areaTime = $("body > div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(2)").text();
    let area = areaTime.split('/')[0].trim();
    try {
        var duration = parseInt(areaTime.split('/')[1].trim()); 
    } catch (error) {
        var duration = 0
    }
    
    let pubtime = $("body > div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(3)").text().substring(0,10)
    let score;
    let scorenum;
    let boxoffice;
    if($(".index-right .star-on").length==0){
        score =0;
        scorenum = 0;
        boxoffice =0;
        let brief = $('#app > div > div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(1) > div.mod-content > span').text()
        let director = $('#app > div > div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(2) > div.mod-content > div > div:nth-child(1) > ul > li > div > a').text()
        let arr = [moviename,movieimg,cataory,area,duration,pubtime,score,scorenum,boxoffice,brief,director]
        let strSql = 'insert into movie (moviename,movieimg,cataory,area,duration,pubtime,score,scorenum,boxoffice,brief,director) values (?,?,?,?,?,?,?,?,?,?,?)'
        await sqlQuery(strSql,arr)
        console.log(index,"页-",k,"电影信息已写入数据库：",moviename,href);
        k++;
        if(k==hrefList.length){
            hrefList = [];
            k=0;
            console.log(index,"页数据已爬取完毕!-----")
            index++;
            getPageList(index)

        }else{
            getMovieInfo(hrefList[k])
        }
    }else{
        score = $(".index-right .star-on").css("width").substring(0,2);
        //console.log(scorenum)
    
        let fontUrl = $("head > style").html()
        let reg = /format.*?url\('(.*?woff)'\)/igs;
        //console.log(fontUrl)
        let result = reg.exec(fontUrl)
        let fontPath = result[1]

        let brief = $('#app > div > div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(1) > div.mod-content > span').text()
        let director = $('#app > div > div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(2) > div.mod-content > div > div:nth-child(1) > ul > li > div > a').text()
        
        console.log(fontPath)
        axios.get("http:"+fontPath,{responseType:"stream"}).then(function(res){
            let ws = fs.createWriteStream('a.woff')
            res.data.pipe(ws);
            ws.on("close",()=>{
                console.log("字体文件写入")
                let aa = $("body > div.banner > div > div.celeInfo-right.clearfix > div.movie-stats-container > div:nth-child(1) > div > div > span > span").text()
                //评分数量
                //console.log(aa)
                let arr1 = aa.split("")
                let b = 0;
                let arr11 = []
                arr1.forEach(async (item,i)=>{
                    let result = await parseNum(item);
                    //console.log(result)
                    b++
                    arr11[i] = parseFloat(result.max)>0.5?result.key:item;
                    if(b==arr1.length){
                        scorenum = arr11.join("")
                        scorenum = parseChar(scorenum);
                        scorenum = isNaN(scorenum)?0:scorenum;
                        console.log(scorenum);
                        //console.log('--aa--')
                        let bb = $("body > div.banner > div > div.celeInfo-right.clearfix > div.movie-stats-container > div:nth-child(2) > div > span.stonefont").text()
                        //票房
                        //console.log(bb)
                        let arr2 = bb.split("")
                        if(arr2.length==0){
                            arr2 = ["0"]
                        }
                        let arr22 = []
                        let a = 0;
                        arr2.forEach(async (item,i)=>{
                            let result = await parseNum(item,fontPath);
                            arr22[i] = parseFloat(result.max)>0.5?result.key:item;;
                            a++
                            if(a==(arr2.length)){
                                boxoffice = arr22.join("")+$("body > div.banner > div > div.celeInfo-right.clearfix > div.movie-stats-container > div:nth-child(2) > div > span.unit").text()
                                boxoffice = parseChar(boxoffice)
                                boxoffice = isNaN(boxoffice)?0:boxoffice;
                                console.log(boxoffice)
                                let arr = [moviename,movieimg,cataory,area,duration,pubtime,score,scorenum,boxoffice,brief,director]
                                let strSql = 'insert into movie (moviename,movieimg,cataory,area,duration,pubtime,score,scorenum,boxoffice,brief,director) values (?,?,?,?,?,?,?,?,?,?,?)'
                                await sqlQuery(strSql,arr)
                                console.log(index,"页-",k,"电影信息已写入数据库：",moviename,href);
                                k++;
                                if(k==hrefList.length){
                                    hrefList = [];
                                    k=0;
                                    console.log(index,"页-"+k+"数据已爬取完毕!-----")
                                    index++;
                                    getPageList(index)

                                }else{
                                    getMovieInfo(hrefList[k])
                                }
                                
                            }
                            
                            //console.log(result)
                        })
                    }
                    
                })
                
                
            })
            
        })

    }               
    

    
        



}
//https://maoyan.com/films/246300
//getMovieInfo("https://maoyan.com/films/1250952")
//getMovieInfo("https://maoyan.com/films/342773");
function parseChar(str){
    let unit = str[str.length-1];
    switch(unit){
        case "万":
            return parseFloat(str.substring(0,str.length-1))*10000;
        case "亿":
            return parseFloat(str.substring(0,str.length-1))*100000000;
        default:
            return parseFloat(str);
    }
}

function sqlQuery(strSql,arr){
    return new Promise(function(resolve,reject){
        con.query(strSql,arr,(err,results)=>{
            //console.log(err)
            //console.log(results)
            if(err){
                reject(err)
                //console.log(err)
            }else{
                
                resolve(results)
                
            }
           
        })
    })
}