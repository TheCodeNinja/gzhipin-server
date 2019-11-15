module.exports = function(server) {

    // 得到io對象
    const io = require('socket.io')(server)
    console.log('[ Server ]: listening to client soketio connection')

    // 監听客戶端的連接
    io.on('connection', function(socket) { // socket: 某个客戶端与該服務器的連接对象
        console.log('[ Server ]: client soketio connected')

        // 監听該socket上的event: sendMsg (來自客戶端)
        socket.on('sendMsg', function(data) { // data: 來自客戶端發送的消息      
            console.log('[ Server ]: received message from one browser', data)

            // 向連接當前socket的某个客戶端發送消息
            // socket.emit('receiveMsg', data.name + '_' + data.date) 

            // 向所有連接服務器的客戶端發送消息
            io.emit('receiveMsg', data.name + '_' + data.date)  
            console.log('[ Server ]: sent message to all connected browsers', data.name + '_' + data.date)
        })
    })
}