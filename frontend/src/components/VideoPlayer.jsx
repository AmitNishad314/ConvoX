import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="w-[380px] h-[280px] bg-black rounded-xl object-cover border border-slate-700"
    />
  );
};

export default VideoPlayer;