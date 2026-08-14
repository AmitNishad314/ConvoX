
import {Server} from "socket.io"


let messages = {}
let timeOnline = {}

const connectToSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:'*',
            methods: ['GET','POST'],
            allowedHeaders:['*'],
            credentials: true
        }
    });
     
    io.on("connection",(socket)=>{
        console.log("Socket Connected:", socket.id);

        socket.on("join-call", (roomId) => {

            socket.join(roomId);
        
            timeOnline[socket.id] = new Date();
        
            socket.to(roomId).emit("user-joined", socket.id);
        
            if (!messages[roomId]) return;
        
            messages[roomId].forEach((msg) => {
                socket.emit(
                    "chat-message",
                    msg.data,
                    msg.sender,
                    msg["socket-id-sender"]
                );
            });
        
        });
        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id ,message);
        })
        socket.on("chat-message", (data, sender, roomId) => {

            if (!messages[roomId]) {
                messages[roomId] = [];
            }
        
            messages[roomId].push({
                sender,
                data,
                "socket-id-sender": socket.id,
            });
        
            io.to(roomId).emit(
                "chat-message",
                data,
                sender,
                socket.id
            );
        
        });
            

        socket.on("disconnect", () => {

            console.log(`${socket.id} disconnected`);
        
            for (const roomId of socket.rooms) {
        
                if (roomId !== socket.id) {
                    socket.to(roomId).emit("user-left", socket.id);
                }
        
            }
        
            delete timeOnline[socket.id];
        
        });
    })

    return io;
}
export default connectToSocket