const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.render('home');
})

io.on('connection', socket => {

    console.log('user connected')
    io.emit('message', "selamat datang")

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('stream', data => {
        io.emit('stream', data)
    })
    
})






server.listen(PORT, () => console.log(`http://localhost:${PORT}`))