# realtime-chat
#### Realtime chat application using nodejs , vanilajs, mongodb html ad css

## Preview Project

![screencapture-localhost-5000-2023-01-22-11_30_55](https://user-images.githubusercontent.com/83384315/213902909-62763785-9b0c-400e-8d27-ecf82d50b767.png)


## load nodejs express server
```js
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 5000
```

## use static middleware of express sever
```js
app.use(express.static('public'))
```

## mongo database
```js
const dbconnect = require('./database')
dbconnect();
```
## create route for api/messages
```js
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
```
## Server Start
```js
http.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})
```
## setup socket.io
```js
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
```

# Client JS
## call the socket server
```js
const socket = io()
```

## send messages
```js
msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;
  let msg = {
    user : name,
    message:msgText,
  }
  fetchmessage(msg)
  appendMessage(name, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  socket.emit('message',msg)
  // sync with mongodb
  sincWithdb(msg)
});
```

## api call to mongodb
```js
function sincWithdb(msg) {
  const headers = {
    'Content-Type' : 'application/json',
  }
  fetch('/api/messages', { method : 'Post', body: JSON.stringify(msg), headers})
    .then(response => response.json())
      .then(result => {
        console.log(result)
      })
}

function fetchmessage(msg) {
  fetch('/api/messages')
    .then(res => res.json())
    .then(result => {
      result.forEach((messages) => {
        messages.time = messages.createdAt
        appendMessage(messages.username,PERSON_IMG,"left",messages.message)
      })
      console.log(result)
    })
}

```

## recieved the messages form server
```js
socket.on('message',(msg) => {
  botResponse(msg)
})
``` 

## Schemea of MongoDB
```js
const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  username: {type:String, require: true},
  message: {type: String, require: true}
},{timestamps:true});

const Message = mongoose.model('Message',thingSchema)
module.exports = Message
```





