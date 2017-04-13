var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
//此插件可以让我们把会话信息保存在mongodb数据库中
var MongoStore = require('connect-mongo')(session);
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var app = express();
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(path.resolve('public')));
app.use(bodyParser.urlencoded({extended:true}));
// 会在req.session 是此客户端在服务器上的对应的数据对象，保存着此客户端的数据
app.use(session({
    resave:true,//每次请求都重新保存session
    saveUninitialized:true,//保存未初始的session
    secret:'zfpx', //加密session的秘钥
    //指定会话的存储位置
    store:new MongoStore({
        url:'mongodb://127.0.0.1/blog'
    })
}));
//会增加req.flash方法
// req.flash(type,msg);  req.flash(type);
app.use(flash());
//设置模板引擎
app.set('view engine','html');
//设置模板的存放目录
app.set('views',path.resolve('views'));
//设置模板渲染方法
app.engine('html',require('ejs').__express);
app.use(function(req,res,next){
//要把req.session中的user取出来赋给模板变量 数据对象
   res.locals.user = req.session.user;
   console.log(res.locals.user);
   res.locals.success = req.flash('success').toString();
   res.locals.error = req.flash('error').toString();
   res.locals.keyword = '';
   next();
});

//1参数 是请求过来的路径的前缀
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.listen(8080);