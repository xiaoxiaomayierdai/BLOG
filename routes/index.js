var express = require('express');
var Article = require('../model').Article;
var router = express.Router();
router.get('/',function(req,res){
    //populate 填充的意思，就是把ID变成对象
    //只有调用 exec方法的时候才会真正执行查询
  //每页的记录数，默认为5
  var pageSize = isNaN(req.query.pageSize)?5:parseInt(req.query.pageSize);
  //当前页码数，默认为第一页
  var pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);
  var keyword = req.query.keyword;
  var pattern = new RegExp(keyword);
  var query = {};
  if(keyword){
      //query= {$or:[{title:/a/,content:/a/}]}
      query['$or'] = [{title:pattern},{content:pattern}];
  }
  //要查询有多少条记录，也就是总记录数
  Article.count(query,function(err,count){
      Article.find(query).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
          res.render('index',{
              title:'首页',
              //向上取整(总记录数/每页的记录数)=总页数
              totalPages:Math.ceil(count/pageSize),
              pageSize,
              pageNum,
              keyword,
              articles
          });
      });
  })

});
module.exports = router;