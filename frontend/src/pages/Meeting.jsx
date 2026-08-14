import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import { createPeerConnection } from "../services/webrtc";
import VideoPlayer from "../components/VideoPlayer";

const Meeting = () => {
  const { roomId } = useParams();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const peers = useRef({});

  useEffect(() => {
    socket.connect();

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(async (stream) => {
        setLocalStream(stream);

        socket.emit("join-room", roomId);

        socket.on("room-users", async (users) => {
          for (const id of users) {
            const peer = createPeerConnection(
              id,
              socket,
              stream,
              (remoteStream, peerId) => {
                setRemoteStreams((prev) => {
                  if (prev.find((x) => x.id === peerId)) return prev;
                  return [...prev, { id: peerId, stream: remoteStream }];
                });
              }
            );

            peers.current[id] = peer;

            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            socket.emit("offer", {
              target: id,
              offer,
            });
          }
        });

        socket.on("user-joined", (id) => {
          console.log("User joined:", id);
        });

        socket.on("offer", async ({ offer, caller }) => {
          const peer = createPeerConnection(
            caller,
            socket,
            stream,
            (remoteStream, peerId) => {
              setRemoteStreams((prev) => {
                if (prev.find((x) => x.id === peerId)) return prev;
                return [...prev, { id: peerId, stream: remoteStream }];
              });
            }
          );

          peers.current[caller] = peer;

          await peer.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          const answer = await peer.createAnswer();

          await peer.setLocalDescription(answer);

          socket.emit("answer", {
            target: caller,
            answer,
          });
        });

        socket.on("answer", async ({ answer, caller }) => {
          await peers.current[caller].setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        });

        socket.on("ice-candidate", async ({ candidate, caller }) => {
          if (peers.current[caller]) {
            await peers.current[caller].addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        });

        socket.on("user-left", (id) => {
          if (peers.current[id]) {
            peers.current[id].close();
            delete peers.current[id];
          }

          setRemoteStreams((prev) =>
            prev.filter((x) => x.id !== id)
          );
        });
      });

    return () => {
      socket.disconnect();

      Object.values(peers.current).forEach((peer) => peer.close());

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Room : {roomId}
      </h1>

      <div className="flex flex-wrap gap-6">
        {localStream && (
          <VideoPlayer stream={localStream} muted />
        )}

        {remoteStreams.map((user) => (
          <VideoPlayer
            key={user.id}
            stream={user.stream}
          />
        ))}
      </div>
    </div>
  );
};

export default Meeting;