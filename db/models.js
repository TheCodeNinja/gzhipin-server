/** 包含n个操作数据库集合的Model模块 */

/*
一 连接数据库
1. 引入mongoose
2. 连接数据库
3. 获取连接对象
4. 监听连接
*/

const md5 = require('blueimp-md5')
const mongoose = require('mongoose')
mongoose.connect(
    'mongodb://localhost:27017/gzhipin', 
    { useUnifiedTopology: true, useNewUrlParser: true }
)
const conn = mongoose.connection
conn.on('connected', () => {
    console.log('DB connected successfully!')
})

/*
二 得到对应特定集合的Model
1. 定义Shema（描述文档结构/document）文档是对象
2. 定义Model（与集合对应，可以操作集合/collection）集合是数组
3. 向外暴露Model
*/

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String},
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel
// module.exports = xxx  这个方式只能写一次, 叫做一次性暴露
// exports.xxx = value 这个方式可以写多次, 叫做分别暴露
