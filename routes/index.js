var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const { UserModel } = require('../db/models')

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


module.exports = router;
