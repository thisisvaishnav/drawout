import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, SigninSchema } from "@repo/common/types";

const app = express();

app.post("/signup", (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if ( !data.success) {
        return res.json({
            message: "Incorect inputs"
        })
        return;
    }
    res.json({
        userId:"123"
    })
});



// POST /login - Authenticates user and returns a JWT token
app.post("/login", (req, res) => {
    // Hardcoded userId (in production, fetch from DB after validating credentials)
    const userId = 1;

    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            message: "Incorrect input"
        })
        return
    }

    // Create JWT with userId in payload, signed with secret key
    const token = jwt.sign({
        userId,
    }, JWT_SECRET);

    // Send token back to client for future authenticated requests
    res.json({ token });
});

app.post("/room", middleware, (req, res) => {   
    res.json({
        roomId: 123
    })
});

