const express = require("express");
const app = express();
const superagent = require("superagent");
const cheerio = require("cheerio");

let chapterList = []; // 章节列表

let server = app.listen(3000, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Your App is running at http://%s:%s", host, port);
});

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问百度新闻首页
 */
superagent.get("https://www.yymhh.com/manhua/kx4qoA.html").end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`);
  } else {
    // 抓取章节列表
    chapterList = getChapterUrlList(res);
  }
});

/**
 * index.js
 * [description] - 抓取热点新闻页面
 */
let getChapterUrlList = res => {
  console.log(res.text);
  let chapterUrlList = [];
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);

  // 找到目标数据所在的页面元素，获取数据
  $("div#chapterList li a").each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let news = {
      title: $(ele).text(), // 获取新闻标题
      href: $(ele).attr("href") // 获取新闻网页链接
    };
    chapterUrlList.push(news); // 存入最终结果数组
  });
  return chapterUrlList;
};

/**
 * [description] - 跟路由
 */
// 当一个get请求 http://localhost:3000时，就会后面的async函数
app.get("/", async (req, res, next) => {
  res.send(chapterList);
});
