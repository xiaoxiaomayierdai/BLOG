var mongoose = require('mongoose');
mongoose.Promise = Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
//连接数据库
mongoose.connect('mongodb://127.0.0.1/blog');
//定义骨架模型Schema
var UserSchema = new mongoose.Schema({
    username:{type:String,isRequired:true},
    password:{type:String,isRequired:true},
    email:String,
    avatar:String
});
//定义导出Model
exports.User = mongoose.model('User',UserSchema);
var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    //类型是日期，默认值是当前时间
    createAt:{type:Date,default:Date.now},
    //类型是对象ID类型，引用的是User集合中的ID
    user:{type:ObjectId,ref:'User'}
});
exports.Article = mongoose.model('Article',ArticleSchema);