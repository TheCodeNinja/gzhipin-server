var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const { UserModel } = require('../db/models')
const filter = {password: 0, __v: 0} // 指定過濾的属性

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 註册一個路由：用戶註册

/*
a）path为：/register
b）请求方式为：POST
c）接受username和password参数
d）admin是已注册用户
e）注册成功返回：{code: 0, data: {_id: 'abc', username: 'xxx', password:'123}
f）注册失败返回：{code: 1, msg: '此用户已存在'}
*/

/*
1. 获取请求参数数据
2. 处理数据
3. 返回响应
*/
router.post('/register', function(req, res) {
  // 获取请求参数数据
  const { username, password, type } = req.body;
  // 处理数据
  UserModel.findOne({username}, function(err, user) {
    // 在數據庫中已存在該數據
    if (user) { 
      res.send({code: 1, msg: '此用户已存在'})
    }
    // 在數據庫中不存在該數據
    else {
      new UserModel({username, password:md5(password), type}).save(function(error, user) {
        // 生成一个cookie(key, value)，并交给浏览器保存
        res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
        const data = {username, type, _id:user._id} // 响应数据中不要携带密码
        res.send({code: 0, data})
      }) 
    }
  })

})

// 登陆路由
router.post('/login', function(req, res) {
  // 获取请求参数数据
  const {username, password} = req.body
  // 根据username和password查询数据库users
  UserModel.findOne({username, password: md5(password)}, filter, function(err, user) {
    // 登陆成功
    if (user) { 
      // 生成一个cookie(key, value)，并交给浏览器保存
      res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
      res.send({code: 0, data: user}) // password is filtered
    }
    // 登陆失败
    else {
      res.send({code: 1, msg: '用户名或密码不正确'})
    }
  })
})

// 更新用戶信息的路由
router.post('/update', function(req, res) {
  const user = req.body // 沒有 _id
  // 从browser請求發送出的cookie得到userId
  const userId = req.cookies.userId
  // 如不存在userId
  if (!userId) {
    return res.send({code: 1, msg: '请先登陆'}) // "return" = 結束程式繼續往下执行
  }
  // 如存在userId
  // 根据userId更新数据庫对应的user文档(document)
  UserModel.findByIdAndUpdate({_id: userId}, user, function(error, oldUser) {
    // 如旧user沒有返回
    if (!oldUser) {
      // 通知browser删除該userId的cookie
      res.clearCookie('userId')
      res.send({code: 1, msg: '请先登陆'})
    }
    // 如旧user有返回
    else {
      const {_id, username, type} = oldUser // 拆解oldUser对象
      // 准备一个返回的user数据对象
      // assign(obj1, obj2, obj3, ...) 將多个指定的对象合并, 返回一个合并后的对象
      const data = Object.assign(user, {_id, username, type})
      res.send({code: 0, data})
      
      /*
      Successful response to browser for bossinfo update:

      {
        "code": 0,
        "data": {
          "header": "头像10",
          "post": "front-end developer",
          "company": "google",
          "salary": "20k",
          "info": "javascript",
          "_id": "5dbfd4ce59393d089c096c3f",
          "username": "Mario",
          "type": "recruit"
        }
      }

      Successful response to browser for jobseekerinfo update:

      {
        "code": 0,
        "data": {
          "header": "头像10",
          "post": "front-end developer",
          "info": "know javascript, python",
          "_id": "5dbfd4ac59393d089c096c3e",
          "username": "Yoshi",
          "type": "findJob"
        }
      }
      */
    }
  })
})

module.exports = router;
