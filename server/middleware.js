import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3201 });

wss.on('connection', (ws) => {
  console.log('A new client connected');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });
});

console.log('WebSocket server is running on ws://localhost:3201');
