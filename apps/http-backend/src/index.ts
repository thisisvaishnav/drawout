import express from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, UserSchema, CreateRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db";
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
});

// POST /login - Authenticates user and returns a JWT token
app.post("/signin", async (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: data.data.username,
            password: data.data.password
        },
        select: {
            id: true,
        }
    })
    if (!user) {
        res.status(401).json({
            message: "User not found"   
        })
        return;
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);
    res.json({ token });
    
});

app.post("/room", middleware, async (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore
    const userId = (req as any).userId;
    try {
    const room = await prismaClient.room.create({
        data: {
            slug: data.data.name,
            adminId: userId
        },
        });
        res.json({ roomId: room.id });
    } catch (e) {
        res.status(500).json({ message: "Failed to create room cause room already exists" });
    }
});

app.listen(3001, () => {
    console.log("HTTP Backend running on port 3001");
});
