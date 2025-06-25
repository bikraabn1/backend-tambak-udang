

const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Web Server is running');
})

function generateRandomData(id) {
  const tds = Math.floor(Math.random() * 300); 
  const ph = (Math.random() * 14).toFixed(2); 
  const color = Math.floor(Math.random() * 16777215).toString(16).toUpperCase(); 
  const time = new Date().toISOString(); 
  const doValue = (Math.random() * 14).toFixed(2); 
  const temp = (Math.random() * 40).toFixed(2); 
  const sal = (Math.random() * 50).toFixed(2); 

  return { id, tds, ph, color, time, doValue, temp, sal };
}

wss.on('connection', (ws) => {
  console.log('New Client Connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    ws.send(JSON.stringify({
      type: 'response',
      message: `Server received: ${message}`,
      timestamp: new Date().toISOString()
    }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  let idCounter = 1;
  const dataInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const randomData = generateRandomData(idCounter++);
      ws.send(JSON.stringify(randomData));
    } else {
      clearInterval(dataInterval);
    }
  }, 1000);

  ws.on('close', () => {
    clearInterval(dataInterval);
  });
});

const PORT = 5500;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});