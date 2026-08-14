import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";
import { createPeerConnection } from "../services/webrtc";
import VideoPlayer from "../components/VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";

const Meeting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");

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
        socket.on("chat-message", (data) => {
            setMessages((prev) => [...prev, data]);
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
        socket.off("room-users");
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    socket.off("user-left");
    socket.off("chat-message");
      socket.disconnect();

      Object.values(peers.current).forEach((peer) => peer.close());

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
  
    const sender =
      JSON.parse(localStorage.getItem("user"))?.name || "Anonymous";
  
    socket.emit("chat-message", {
      roomId,
      sender,
      message,
    });
  
    setMessage("");
  };
  const toggleMic = () => {
    if (!localStream) return;
  
    const audioTrack = localStream.getAudioTracks()[0];
  
    if (!audioTrack) return;
  
    audioTrack.enabled = !audioTrack.enabled;
  
    setMicOn(audioTrack.enabled);
  };
  const toggleCamera = () => {
    if (!localStream) return;
  
    const videoTrack = localStream.getVideoTracks()[0];
  
    if (!videoTrack) return;
  
    videoTrack.enabled = !videoTrack.enabled;
  
    setCameraOn(videoTrack.enabled);
  };
  const leaveMeeting = () => {
    Object.values(peers.current).forEach((peer) => peer.close());
  
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  
    socket.disconnect();
  
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
  
      {/* Header */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-slate-800">
        <h1 className="text-2xl font-bold text-indigo-500">
          ConvoX
        </h1>
  
        <div className="text-slate-300">
          Room :
          <span className="ml-2 text-green-400 font-semibold">
            {roomId}
          </span>
        </div>
  
        <div className="text-slate-400">
          Participants : {remoteStreams.length + 1}
        </div>
      </div>
  
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
  
        {/* Video Area */}
        <div className="flex-1 p-6">
  
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  
            {localStream && (
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                <VideoPlayer stream={localStream} muted />
                <div className="p-3 text-center font-medium">
                  You
                </div>
              </div>
            )}
  
            {remoteStreams.map((user) => (
              <div
                key={user.id}
                className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg"
              >
                <VideoPlayer stream={user.stream} />
  
                <div className="p-3 text-center font-medium">
                  Participant
                </div>
              </div>
            ))}
  
          </div>
  
        </div>
  
        {/* Chat */}
        <div className="w-[340px] bg-slate-900 border-l border-slate-800 flex flex-col">
  
          <div className="p-4 border-b border-slate-800 font-semibold text-lg">
            Chat
          </div>
  
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
  
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-3"
              >
                <p className="text-indigo-400 font-semibold">
                  {msg.sender}
                </p>
  
                <p className="mt-1">
                  {msg.message}
                </p>
  
                <p className="text-xs text-slate-400 mt-2">
                  {msg.time}
                </p>
              </div>
            ))}
  
          </div>
  
          <div className="p-4 flex gap-2 border-t border-slate-800">
  
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 rounded-lg px-4 py-2 outline-none"
            />
  
            <button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 rounded-lg"
            >
              Send
            </button>
  
          </div>
  
        </div>
  
      </div>
  
      {/* Bottom Controls */}
      <div className="h-20 border-t border-slate-800 flex justify-center items-center gap-5 bg-slate-950">
  
        <button
          onClick={toggleMic}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            micOn
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {micOn ? "🎤 Mute" : "🎤 Unmute"}
        </button>
  
        <button
          onClick={toggleCamera}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            cameraOn
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {cameraOn ? "📷 Camera Off" : "📷 Camera On"}
        </button>
  
        <button
          onClick={leaveMeeting}
          className="px-8 py-3 rounded-full bg-red-700 hover:bg-red-800 font-semibold"
        >
          📞 Leave
        </button>
  
      </div>
  
    </div>
  );
};

export default Meeting;