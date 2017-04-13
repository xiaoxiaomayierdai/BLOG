/**
 * 编写一个中间件函数
 * 当客户端未登录时则跳到登录页
 * 如果已登录后则可以继续访问
 */
exports.checkMustLogin = function(req,res,next){
   if(req.session.user){
       next();
   }else{
       req.flash('error','你尚未登录，请登录再访问此页面');
       res.redirect('/user/signin');
   }
};
/**
 * 编写一个中间件函数
 * 当客户端未登录时可以继续访问
 * 如果已登录后则跳到首页去
 */
exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','你已经登录，请不要重复登录或注册');
        res.redirect('/');
    }else{
        next();
    }
};