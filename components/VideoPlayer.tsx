"use client";

import { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ isPurple }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayClick = () => {
    setIsVideoVisible(true);
  };

  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay failed:", err);
      });
    }
  }, [isVideoVisible]);

  const posterImage = isPurple
    ? '/video_thumbnail_purple.webp'
    : '/video_thumbnail.png';

  const videoSrc = isPurple
    ? 'https://cdn.hammerandbell.shop/public/Auctropin-40iu-purple.mp4'
    : process.env.NEXT_PUBLIC_HOME_PAGE_VIDEO_URL;

  return (
    <div style={{ position: 'relative', maxWidth: "1360px", margin: "auto", width: "100%" }}>
      {!isVideoVisible ? (
        <div
          onClick={handlePlayClick}
          style={{
            position: 'relative',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <img
            src={posterImage}
            alt="Video thumbnail"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          muted={false}
          autoPlay
          loop
          style={{ width: '100%', height: 'auto' }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
