import express from  "express"
import {createServer} from "node:http"

import {Server} from "socket.io"
import mongoose from "mongoose"

import cors from "cors"
import userRoutes from "../src/routes/user.routes.js"

import connectToSocket from "./controllers/socketManager.js"

const app = express()
const server = createServer(app)
const io= connectToSocket(server)

app.set("port",(process.env.port||3000))
app.use(cors())
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb",extended:true}))
app.use("/users", userRoutes)
 
app.get("/home",(req,res)=>{
    res.send("welcome to home")
    console.log("you are in home")
})
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ConvoX Backend Running"
    });
});
server.listen(app.get("port"), async() => {
    try{
        const connectDb = await mongoose.connect("mongodb+srv://nishadamit314_db_user:0n7gi96fq5cn6y4J@convox.surcite.mongodb.net/")

console.log("Database:", connectDb.connection.name);
console.log("Host:", connectDb.connection.host);
    console.log(`MoNGo connected to DB host ${connectDb.connection.host}`)
    console.log("Server is running on port 3000")
    }catch(err){
        console.error("mongodb connection failed ",err.message)
        process.exit(1)
    }
})
