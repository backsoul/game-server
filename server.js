'use strict';

const express = require('express');
const { Server: WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server });
const clients = new Set();
// Definir la tasa de FPS deseada
const targetFPS = 30;
const msPerFrame = 1000 / targetFPS;

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', (data) => {
      const jsonParse = JSON.parse(data);
      const jsonString = JSON.stringify(jsonParse);
  
      for (const client of clients) {
          if (client.readyState === ws.OPEN) {
            setInterval(() =>{
              client.send(jsonString);
            }, msPerFrame);
          }
      }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});
