const { ChatModel } = require('../db/models')
 
module.exports = function(server) {

    const io = require('socket.io')(server)

    // Listen to client connection on this socket
    io.on('connection', function(socket) {
        console.log('Client connected ...')

        // Listen to the socket event
        socket.on('sendMsg', function({from, to, content}) {
            console.log('[ Server Received ]', {from, to, content})
            
            // Prepare data of model object
            const chat_id = [from, to].sort().join('_') // from_to or to_from
            const created_at = Date.now()

            // Store data
            new ChatModel({from, to, content, chat_id, created_at}).save(function(error, chatMsg) {
                // Send data to all connected client
                io.emit('receiveMsg', chatMsg)
            })
        })
    })
}