/*
一. 使用mongoose连接数据库
1. 引入mongoose
2. 连接数据库
3. 获取连接对象
4. 监听连接
*/

const md5 = require('blueimp-md5') // 加密的函数
// 1. 引入mongoose
const mongoose = require('mongoose')
// 2. 连接数据库
mongoose.connect('mongodb://localhost:27017/gzhipin_test', { useNewUrlParser: true })
// 3. 获取连接对象
const conn = mongoose.connection
// 4. 监听连接
conn.on('connected', function() {
    console.log('数据库连接成功！')
})
conn.on('error',function() {
    console.log('数据库连接失败！')
})

/*
二. 得到对应特定集合的Model
1. 定义Shema（描述文档结构/document）文档是对象
2. 定义Model（与集合对应，可以操作集合/collection）集合是数组
*/

const userSchema = mongoose.Schema({ // 指定文档的结构
    username: { type: String, required: true }, 
    password: { type: String, required: true },
    type: { type: String, required: true }, // Two types: findJob/recruit
    header: { type: String }
});

const UserModel = mongoose.model('user', userSchema)

/*
三. 通过Model或其实例对集合数据进行CRUD操作
1. 通过Model实例用save()添加数据
2. 通过Model的find()/findOne()查询多个或一个数据
*/

// 添加文档
function testSave() {
    // 创建UserModel的实例
    // mongoDB自动生成user文档id
    const userModel = new UserModel({
        username: 'Mario', 
        password: md5('pass1234'), 
        type: 'findJob'
    })
    // 调用save()保存
    userModel.save(function(err, userDoc) {
        if (err) {
            console.log(err)
        }
        console.log('save()', err, userDoc)
    })
}

// testSave()

/* 
OUTPUT: 
save() null {
    _id: 5dbfa8f546d8a91ab0bbd01d,
    username: 'Mario',
    password: 'b4af804009cb036a4ccdc33431ef9ac9',
    type: 'findJob',
    __v: 0
}
*/

// 查询文档
function testFind() {
    // 查询多个文档
    UserModel.find(function(error, users) { // 这里的UserModel是一个函数对象
        console.log('find()', error, users)
    })
    
    // 查询一个文档
    UserModel.findOne({_id: '5dbfae76815131133c1e4869'}, function(error, user) {
        console.log('findOne()', error, user)
    })
}

testFind()

/*
OUTPUT:
如果有匹配：
find() null [
  {
    _id: 5dbfa8f546d8a91ab0bbd01d,
    username: 'Mario',
    password: 'b4af804009cb036a4ccdc33431ef9ac9',
    type: 'findJob',
    __v: 0
  },
  {
    _id: 5dbfae76815131133c1e4869,
    username: 'Yoshi',
    password: 'b4af804009cb036a4ccdc33431ef9ac9',
    type: 'recruit',
    __v: 0
  }
]
findOne() null {
  _id: 5dbfae76815131133c1e4869,
  username: 'Yoshi',
  password: 'b4af804009cb036a4ccdc33431ef9ac9',
  type: 'recruit',
  __v: 0
}

如果沒有匹配：
find() null []
findOne() null null
*/
