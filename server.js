const express = require('express');
const WebSocket = require('ws');

const app = express()

// Set up the socket.io server
const server = app.listen(3000, () => {
    console.log('Server listening on port 3000')
});

const io = require('socket.io')(server)
app.locals.io = io

const wsClient = new WebSocket('wss://marketdata.tradermade.com/feedadv');

wsClient.on('open', () => {
    console.log('WebSocket client connected')
  
    wsClient.send('{"userKey":"wsPtsG_k-0EmfXy8W_PA", "symbol":"XAUUSD"}') // Send the subscription data to the server
})

wsClient.on('message', data => {
    data = data.toString();
//     console.log('Received data from websocket: ', data)
    // Send the real-time data to the connected clients
    app.locals.io.sockets.emit('update', data)
})
  
// Handle incoming socket.io connections
io.on('connection', socket => {
    console.log('Socket connected:', socket.id)

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
    });
})

// Set up the routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
