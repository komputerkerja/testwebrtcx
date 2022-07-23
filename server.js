const express = require('express')
const app = express()
const server = require('http').Server(app)
const PORT = process.env.PORT || 5000

app.use(express.static('public'))
app.get('/',(req,res)=>res.render('index.html'))

server.listen(PORT,()=>console.log(`http://localhost:${PORT}`))