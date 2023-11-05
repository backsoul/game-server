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
const messageQueue = [];
let lastSendTime = Date.now();

function processMessageQueue() {
    const now = Date.now();
    if (now - lastSendTime >= 1000) { // Enviar mensajes una vez por segundo
        for (const client of clients) {
            if (client.readyState === ws.OPEN) {
                const messagesToSend = messageQueue.slice();
                client.send(JSON.stringify(messagesToSend));
            }
        }
        messageQueue.length = 0; // Limpiar la cola
        lastSendTime = now;
    }
}

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', (data) => {
        messageQueue.push(JSON.parse(data));
        processMessageQueue();
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});
