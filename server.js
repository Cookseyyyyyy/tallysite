import { WebSocketServer, WebSocket } from 'ws';

// Use Railway's PORT environment variable or fallback to 8080
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server started on port ${PORT}`);

// Keep track of the current status
let currentStatus = 'STANDBY';

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send the current status to new clients when they connect
  ws.send(currentStatus.trim());
  console.log(`Sent initial status to client: ${currentStatus}`);

  ws.on('message', (message) => {
    currentStatus = message.toString().toUpperCase().trim();
    console.log(`Received status from client: ${currentStatus}`);
    console.log(`Status length: ${currentStatus.length}`);

    // Broadcast the status to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(`Broadcasting status to client: ${currentStatus}`);
        client.send(currentStatus);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
