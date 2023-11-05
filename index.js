const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('Server started');
});

const clients = new Set(); // Usamos un conjunto para mantener un registro de las conexiones

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
            if (client.readyState === WebSocket.OPEN) {
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

wss.on('listening', () => {
    console.log('Listening on 8080');
});
