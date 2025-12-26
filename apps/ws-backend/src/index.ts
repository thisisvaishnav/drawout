import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8041 });

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }
    const query = new URLSearchParams(url.split('?')[1]);
    const token = query.get('token');
    if (!token) {
        ws.close();
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
        ws.close();
        return;
    }
   
    console.log('Client connected', decoded);

    ws.on('message', function message(data) {
        console.log('Message received', data);
        ws.send(data);
    });
});