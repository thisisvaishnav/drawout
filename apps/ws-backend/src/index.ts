import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db";    

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

const ensureUserExists = async (userId: string) => {
  await prismaClient.user.upsert({
    where: {
      id: userId
    },
    update: {},
    create: {
      id: userId,
      email: `${userId}@local.test`,
      password: "local",
      name: "Local User"
    }
  });
};

const ensureRoomExists = async (roomId: number) => {
  if (!Number.isFinite(roomId)) {
    return null;
  }

  return prismaClient.room.findUnique({
    where: {
      id: roomId
    }
  });
};

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null; 
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      if (user && parsedData.roomId) {
        const roomIdStr = parsedData.roomId.toString();
        if (!user.rooms.includes(roomIdStr)) {
          user.rooms.push(roomIdStr);
        }
        console.log("User joined room. Current rooms:", user.rooms);
        // Send confirmation back to user
        ws.send(JSON.stringify({
          type: "join_room_success",
          roomId: roomIdStr,
          message: `Successfully joined room ${roomIdStr}`
        }));
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter(x => x !== parsedData.roomId?.toString());
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId?.toString();
      const message = parsedData.message;

      if (!roomId || !message) {
        console.log("Missing roomId or message");
        return;
      }

      try {
        const numericRoomId = Number(roomId);
        const room = await ensureRoomExists(numericRoomId);
        if (!room) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Room not found",
            roomId
          }));
          return;
        }

        await ensureUserExists(userId);
        const result = await prismaClient.chat.create({
            data: {
                roomId: numericRoomId,
                message,
                userId
            }
        });
        console.log("Database Save SUCCESS:", result);
      } catch (e) {
        console.error("Database Save FAILED:", e);
      }

      // Broadcast to ALL users in the room (including sender)
      console.log("=== BROADCASTING ===");
      console.log("Total connected users:", users.length);
      console.log("Target roomId:", roomId);
      
      users.forEach(user => {
        console.log(`User ${user.userId} rooms:`, user.rooms);
        
        if (user.rooms.includes(roomId)) {
          // Check if WebSocket is open before sending
          if (user.ws.readyState === WebSocket.OPEN) {
            console.log(`✓ Sending to user ${user.userId}`);
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId
            }));
          } else {
            console.log(`✗ User ${user.userId} WebSocket not open (state: ${user.ws.readyState})`);
          }
        } else {
          console.log(`✗ User ${user.userId} not in room ${roomId}`);
        }
      });
      console.log("=== BROADCAST COMPLETE ===");
    }

});



});