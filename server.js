const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Create an HTTP server instead of an HTTPS server
const server = http.createServer(app);

// Initialize the Socket.IO server
const io = require('socket.io')(server);
app.locals.io = io;

// Connect to the WebSocket endpoint over an insecure connection
const wsClient = new WebSocket('wss://marketdata.tradermade.com/feedadv');

wsClient.on('open', () => {
  console.log('WebSocket client connected');
  wsClient.send('{"userKey":"wsPtsG_k-0EmfXy8W_PA", "symbol":"XAUUSD"}');
});

wsClient.on('message', data => {
  data = data.toString();
  console.log('Received data from WebSocket: ', data);
  app.locals.io.sockets.emit('update', data);
});

// Handle incoming socket.io connections
app.locals.io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Set up the routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
