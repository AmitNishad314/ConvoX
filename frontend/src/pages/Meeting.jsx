import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import VideoPlayer from "../components/VideoPlayer";

const Meeting = () => {
  const { roomId } = useParams();

  const myVideo = useRef(null);

  const [stream, setStream] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.connect();
  
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });
  
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
  
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
  
        console.log("Joining room:", roomId);
  
        socket.emit("join-call", roomId);
      })
      .catch((err) => {
        console.log(err);
      });
  
    socket.on("user-joined", (socketId) => {
      console.log("User Joined:", socketId);
  
      setParticipants((prev) => {
        if (prev.includes(socketId)) return prev;
        return [...prev, socketId];
      });
    });
  
    socket.on("user-left", (socketId) => {
      console.log("User Left:", socketId);
  
      setParticipants((prev) =>
        prev.filter((id) => id !== socketId)
      );
    });
  
    return () => {
      socket.off("connect");
      socket.off("user-joined");
      socket.off("user-left");
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-indigo-500">
          ConvoX
        </h1>

        <p>
          Room :
          <span className="ml-2 text-green-400">
            {roomId}
          </span>
        </p>

      </div>

      <div className="p-10">

      <VideoPlayer
    stream={stream}
    muted={true}
/>

        <div className="mt-8">

          <h2 className="text-xl font-semibold">
            Participants
          </h2>

          {
            participants.length === 0 ? (
              <p className="text-slate-400 mt-2">
                Waiting for others...
              </p>
            ) : (
              participants.map((id) => (
                <div
                  key={id}
                  className="mt-2 bg-slate-800 rounded-lg p-3"
                >
                  {id}
                </div>
              ))
            )
          }

        </div>

      </div>

    </div>
  );
};

export default Meeting;