var express = require('express');
var Article = require('../model').Article;
var ware = require('../ware');
var router = express.Router();
//写在路径和回调中间则意味着当客户端访问此路径的时候，先走中间件
router.get('/add',ware.checkMustLogin,function(req,res){
    res.render('article/add',{title:'发表文章',article:{}});
});
router.post('/add',ware.checkMustLogin,function(req,res){
    var article = req.body;//{title,content}
    //让作者字段引用了用户对象的主键
    article.user = req.session.user._id;
    Article.create(article,function(err,doc){
        if(err){
            req.flash('error','发表文章失败');
            res.redirect('back');
        }else{
            req.flash('success','发表文章成功');
            res.redirect('/');
        }
    });
});
router.get('/detail/:_id',function(req,res,next){
  var _id = req.params._id;//先得到路径里的ID
  //根据ID查找对应的文章
  Article.findById(_id,function(err,article){
      if(err){
          res.redirect('back');
      }else{
          //渲染详情页
          res.render('article/detail',{title:'文章详情',article});
      }
  })
});
router.get('/delete/:_id',function(req,res){
    var _id = req.params._id;
    Article.remove({_id},function(err,result){
        if(err){
            req.flash('error','删除文章失败');
            res.redirect('back');
        }else{
            req.flash('success','删除文章成功');
            res.redirect('/');
        }
    })
});
router.get('/update/:_id',function(req,res){
  var _id = req.params._id;
  Article.findById(_id,function(err,article){
    if(err){
        res.redirect('back');
    }else{
        res.render('article/add',{article,title:'修改文章'});
    }
  })
});
router.post('/update/:_id',function(req,res){
  var _id = req.params._id;
  Article.update({_id},req.body,function(err,article){
     if(err){
         res.redirect('back');
     }else{
        res.redirect(`/article/detail/${_id}`);
     }
  });
});
module.exports = router;