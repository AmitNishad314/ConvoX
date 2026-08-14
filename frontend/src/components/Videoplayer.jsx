import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted }) => {
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
      className="w-[350px] rounded-xl bg-black"
    />
  );
};

export default VideoPlayer;