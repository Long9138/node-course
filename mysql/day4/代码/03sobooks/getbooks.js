let mysql = require("mysql");
let options = {
    host:"localhost",
    //port:"3306",//可选，默认式3306
    user:"root",
    password:"123456",
    database:"book"
}

//创建与数据库的连接的对象
let con = mysql.createConnection(options);

function sqlQuery(strSql,arr){
    return new Promise(function(resolve,reject){
        con.query(strSql,arr,(err,results)=>{
            if(err){
                reject(err)
                //console.log(err)
            }else{
                resolve(results)
            }
        })
    })
}
async function getBookList(page){
    let strSql = 'select * from book limit ?,20';
    let offsetIndex = (page-1)*20;
    let result = await sqlQuery(strSql,[offsetIndex]);
    return result;
    //console.log(result);
}

//getBookList(1)

module.exports = getBookList