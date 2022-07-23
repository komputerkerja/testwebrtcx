const express = require('express')
const app = express()
const server = require('http').Server(app)
const socketIO = require('socket.io')
const io = socketIO(server)
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.get('/', (req,res) => res.render('index.html'))

io.on('connection', socket => {
    socket.join('room1')
    const allSocketInRoom = io.sockets.adapter.rooms.get('room1')
    if(allSocketInRoom.size > 1) socket.emit('other join',[...allSocketInRoom])

    socket.on('offer', data => {
        socket.to(data.to).emit('offer', {offer:data.offer, from: data.from})
    })

    socket.on('answer', data => {
        socket.to(data.to).emit('answer',{answer:data.answer, from: data.from})
    })

    socket.on('ice candidate', data => {
        socket.to(data.to).emit('ice candidate', {candidate: data.candidate})
    })

})

server.listen(PORT, () => console.log(`http://localhost:${PORT}`))