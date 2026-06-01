'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const VideoPlayer = ({ video, title, description, youtubeUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = !videoEl.muted;
    setIsMuted(videoEl.muted);
  };

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      setIsPlaying(false); // ✅ Set to false when video ends
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    }
    return "";
  };

  const embedUrl = convertToEmbedUrl(youtubeUrl);

  return (
    <div className='bg-black py-8 md:py-12 max-md:mt-12 px-4  md:px-20  '>
      <div className='  flex flex-col items-center justify-center text-center  '>
        <h1 className='text-xl sm:text-3xl  pb-3 text-white'>{title}</h1>
        <p className='text-xs sm:text-lg text-white pb-6'>{description}</p>
      </div>
      <div className='mt-0 relative group'>
        {embedUrl ? (
          /* YouTube embed */
          <iframe
            src={`${embedUrl}?rel=0&controls=1`}
            className="w-full rounded-xl shadow-lg aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* Uploaded video with custom controls */
          <>
            <video
              ref={videoRef}
              className='w-full rounded-xl shadow-lg'
              src={Array.isArray(video) ? video[video.length - 1] : video}
            />

            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className='absolute inset-0 z-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300'
              >
                <div className='bg-black/70 hover:bg-black/90 p-6 rounded-full text-white animate-bounce shadow-lg'>
                  <Play size={36} />
                </div>
              </button>
            )}

            <div className='absolute bottom-5 left-0 right-0 flex items-center justify-between px-5 opacity-0 group-hover:opacity-100 transition duration-300'>
              <button onClick={handlePlayPause} className='bg-black/70 hover:bg-black/90 p-2 rounded-full text-white'>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={handleMute} className='bg-black/70 hover:bg-black/90 p-2 rounded-full text-white'>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button onClick={handleFullscreen} className='bg-black/70 hover:bg-black/90 p-2 rounded-full text-white'>
                <Maximize2 size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
