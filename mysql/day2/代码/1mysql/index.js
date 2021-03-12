const mysql = require('mysql');
let options = {
  host: "localhost",
  // port: "3306", // 可选，默认是3306
  user: "root",
  password: "123456",
  database: "mall"
}
// 创建与数据库的连接的对象
let con = mysql.createConnection(options);

// 建立链接
con.connect((err) => {
  // 如果建立连接失败
  if (err) {
    console.log(err)
  } else {
    console.log("数据库连接成功")
  }
}); 
// 执行数据库语句
// 执行查询语句
// let strSql = "select * from user"
// con.query(strSql, (error, results, fields) => {
//   console.log(error)
//   console.log(results)
//   console.log(fields)
// })

// 删除表
// let strSql2 = "drop table user"
// con.query(strSql2, (error, results) => {
//   console.log(error)
//   console.log(results)
// })

// 删除库
// let strSql3 = "drop database shop"
// con.query(strSql3, (error, results) => {
//   console.log(error)
//   console.log(results)
// })

// 创建库
// let strSql4 = "create database mall"
// con.query(strSql4, (error, results) => {
//   console.log(error)
//   console.log(results)
// })

// 创建表
let strSql5 = `CREATE TABLE newtable  (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NULL,
  password varchar(255) NULL,
  mail varchar(255) NULL,
  PRIMARY KEY (id)
);`
con.query(strSql5, (error, results) => {
  console.log(error)
  console.log(results)
})

// 插入数据
// let strSql6 = "insert into user (id,username,password) values (1,'johnny','123456')"
// con.query(strSql6, (error, results) => {
//   console.log(error)
//   console.log(results)
// })

// let strSql7 = "insert into user (username,password,mail) values (?,?,?)"
// con.query(strSql7,['小红','password','123@126.com'], (error, results) => {
//   console.log(error)
//   console.log(results)
// })