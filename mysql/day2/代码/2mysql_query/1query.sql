-- 查询0-5评分
select * from book where score >= 0 and score <= 5;
-- 查询6-9评分
select * from book where score BETWEEN 6 and 9;
--查询0或9评分
select * from book where score in (0,9);
-- 查询分类为经济管理的书籍
select * from book where cataory = '经济管理'
-- 查询分类不等于小说文学和经济管理的书籍
select * from book where cataory != '小说文学' and cataory != '经济管理'
-- 查询作者为邓荣栋或陈悦的书籍
select * from book where author = '邓荣栋' or author = '陈悦'
select * from book where author in ('邓荣栋','陈悦')
-- 书名跟股票相关的书名
select * from book where bookname like '%股票%';
-- 知道总共5个字符书名，钱面2个是股票
select * from book where bookname like '股票___';

-- 查询邮箱是空的内容
select * from user where mail is null;
-- 查询邮箱为非空的内容
select * from user where mail is not null;
