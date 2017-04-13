var express = require('express');
var multer = require('multer');
var ware = require('../ware');
//指定上传的目录
var upload = multer({dest:'public/uploads'});
var User = require('../model').User;
//返回一路由中间件实例
var router = express.Router();
//用户注册路由,访问的时候要访问 /user/signup
router.get('/signup',ware.checkNotLogin,function(req,res){
 res.render('user/signup',{title:'用户注册'});
});
//req.file req.body
router.post('/signup',ware.checkNotLogin,upload.single('avatar'),function(req,res){
   console.log(req.file);
   var user = req.body;//{username,password,email}
   user.avatar =  '/uploads/'+req.file.filename;
   User.create(user,function(err,doc){
     if(err){
         //req.session.error = '注册失败'
         req.flash('error','注册失败');
         res.redirect('back');
     }else{
         req.flash('success','恭喜你注册成功');
         res.redirect('/user/signin');
     }
   });
});
//用户登录路由
router.get('/signin',ware.checkNotLogin,function(req,res){
    res.render('user/signin',{title:'用户登录'});
});
router.post('/signin',ware.checkNotLogin,function(req,res){
    var user = req.body;
    User.findOne(user,function(err,doc){
        if(err){
            req.flash('error','用户名或密码错误');
            res.redirect('back');
        }else{
            if(doc){
                //把当前用户写入会话对象中
                req.flash('success','用户登录成功');
                req.session.user = doc;
                res.redirect('/');
            }else{
                req.flash('error','用户名或密码错误');
                res.redirect('back');
            }

        }
    });
});
router.get('/signout',ware.checkMustLogin,function(req,res){
   req.session.user = null;
   res.redirect('/');
});
module.exports = router;

/**
 * { fieldname: 'avatar', 表单的字段名name
  originalname: 'baidu.png', 上传的文件的原始文件名
  encoding: '7bit',
  mimetype: 'image/png', 内容类型
  destination: 'public/uploads' 上传的目标目录
  filename: '52d2cf606d86e289530f6be31dc329ed', 保存文件名
  path: 'public\\uploads\\52d2cf606d86e289530f6be31dc329ed',
  size: 1636 }
 **/