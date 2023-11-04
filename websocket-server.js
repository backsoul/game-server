const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        const jsonString = JSON.stringify(parsedData);
        client.send(jsonString);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

module.exports = wss;
