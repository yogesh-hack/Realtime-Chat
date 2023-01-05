// load nodejs express server
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 5000

// use static middleware of express sever
app.use(express.static('public'))

// mongo database
const dbconnect = require('./database')
dbconnect();

// create route for api/messages
const Message = require('./models/chat')
app.use(express.json())

app.post('/api/messages',(req,res) => {
    const messages = new Message({
        username: req.body.user,
        message: req.body.message
    })
    messages.save().then(response => {
        res.send(response)
    })
})

app.get('/api/messages', (req,res) =>{
    Message.find().then(message => {
        res.send(message)
    })
})

http.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

// setup socket.io
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log("Server connected.....")
    // fetch the data from client
    socket.on('message',(msg) => {
         //console.log(msg)
         // send message to all conected browser or client
        socket.broadcast.emit('message',msg)
    })
})







