const express = require('express')
const app = express()
const server = require('http').Server(app)
const socketIO = require('socket.io')
const io = socketIO(server)
const PORT = process.env.PORT || 5000

app.use(express.static('public'))
app.get('/',(req,res)=>res.render('index.html'))

io.on('connection', socket => {
    socket.join('room1')
    const roomLength = io.sockets.adapter.rooms.get('room1')
    if(roomLength.size > 1) socket.emit('other join', [...roomLength])

    socket.on('offer', ({offer,from,to}) => socket.to(to).emit('offer',({offer,from})))
    socket.on('answer', ({answer, from, to}) => socket.to(to).emit('answer', ({answer,from})))
    socket.on('ice candidate', ({candidate, to}) => socket.to(to).emit('ice candidate',({candidate})))
    socket.on('disconnect', () => io.emit('call ended'))
})

server.listen(PORT,()=>console.log(`http://localhost:${PORT}`))