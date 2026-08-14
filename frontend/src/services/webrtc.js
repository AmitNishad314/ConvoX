const configuration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  
  export const createPeerConnection = (
    targetId,
    socket,
    localStream,
    onRemoteStream
  ) => {
    const peer = new RTCPeerConnection(configuration);
  
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: targetId,
          candidate: event.candidate,
        });
      }
    };
  
    peer.ontrack = (event) => {
      onRemoteStream(event.streams[0], targetId);
    };
  
    return peer;
  };