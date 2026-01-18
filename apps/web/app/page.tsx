"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",
      height: "100vh",
      width: "100vw"
    }}>
      <div>
            <input 
        type="text" 
        placeholder="room id" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)} 
      />
      
      
      <button onClick={(
        e => { 

          e.preventDefault();
          router.push(`/room/${roomId}`);
        }
      )}>Join Room</button>
      </div>
    </div>

  ); 
}

 