let LcApp = require('lcapp');
let app = new LcApp()
let fs = require('fs')
let getBookList = require('./getbooks')

app.on('^/$',(req,res)=>{
    
    //首页数据文本的路径
    let bookTextPath = "./booklist/book1.txt"
    //获取数据
    fs.readFile(bookTextPath,{encoding:"utf-8"},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            //正则解析字符串数据
            let dataArr = [];
            let reg = /(\{.*?\})---/igs;
            var result;
            while(result = reg.exec(data)){
                //将匹配到的字符串解析成对象
                let book = JSON.parse(result[1])
                dataArr.push(book)
            }
            let options = {
                books:dataArr
            }
            let templatePath = "./template/index.html"
            res.render(options,templatePath)
        }
    })
    
})


app.on("/page/\\d+",(req,res)=>{
    try {
        let index = parseInt(req.pathObj.base) ;
        //首页数据文本的路径
        let bookTextPath = "./booklist/book"+index+".txt"
        //获取数据
        fs.readFile(bookTextPath,{encoding:"utf-8"},(err,data)=>{
            if(err){
                console.log(err)
                res.end("404!not found");   
            }else{
                //正则解析字符串数据
                let dataArr = [];
                let reg = /(\{.*?\})---/igs;
                var result;
                while(result = reg.exec(data)){
                    //将匹配到的字符串解析成对象
                    let book = JSON.parse(result[1])
                    dataArr.push(book)
                }
                
                let prePage = index-1
                prePage = prePage==0?"":prePage;
                let nextPage = index+1
                nextPage = nextPage==21?"javascript:void(0)":index+1
                let options = {
                    books:dataArr,
                    prePage:prePage,
                    nextPage:nextPage
                }
                let templatePath = "./template/page.html"
                res.render(options,templatePath)
            }
        })
    } catch (error) {
         res.end("404");   
    }
})


app.run(80,()=>{
    console.log("服务器已启动:","http://127.0.0.1")
})