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

wss.on('connection', (ws) => {
    // Cuando un cliente se conecta, agregamos su conexión al conjunto
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', (data) => {
        console.log('Data received', data);
        const parsedData = JSON.parse(data);
        console.log('Parsed JSON Data:', parsedData);

        // Recorremos el conjunto de clientes y enviamos el mensaje a cada uno
        for (const client of clients) {
            // Verificamos si el cliente todavía está conectado antes de enviarle el mensaje
            if (client.readyState === ws.OPEN) { // Cambio aquí
                const jsonString = JSON.stringify(parsedData);
                client.send(jsonString);
            }
        }
    });

    ws.on('close', () => {
        // Cuando un cliente se desconecta, lo eliminamos del conjunto
        clients.delete(ws);
        console.log('Client disconnected');
    });
});
