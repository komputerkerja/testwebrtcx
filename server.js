const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const server = require('http').Server(app)
const WebSocket = require('ws')
const webSocket = new WebSocket.Server({port:8082})
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(ejsLayouts)

app.get('/', (req,res) => {
    res.render('home')
})

webSocket.on('connection', ws => {
    console.log('user connected')
    ws.on('close', () => console.log('user leaved'))
    ws.on('message', data => {
        webSocket.clients.forEach(client => client.send(data.toString()))
    })
})

server.listen(PORT, ()=>console.log(`http://localhost:${PORT}`))