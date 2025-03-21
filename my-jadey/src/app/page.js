"use client";

import { useState, useRef, useEffect } from "react";
import TextImage from "./pages/textImage";
import styles from './styles/Home.module.css';

const Home = () => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTrack, setCurrentTrack] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); 
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); 
  const [isTextHovered, setIsTextHovered] = useState(false);

  const tracks = [
    { title: "Co-Pilot", src: "/music/CoPilot.mp3" },
    { title: "Mahika", src: "/music/Mahika.mp3" },
    { title: "Paraluman", src: "/music/Paraluman.mp3" },
    { title: "Sining", src: "/music/Sining.mp3" },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].src;
      audioRef.current.load(); 
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn("Playback failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleTrackEnd = () => {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleTrackEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleTrackEnd);
      }
    };
  }, [tracks.length]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasStarted(true); 
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    setTimeout(() => {
      if (clickCount === 0) togglePlay();
      else if (clickCount === 1) nextTrack();
      else if (clickCount >= 2) prevTrack();
      setClickCount(0);
    }, 300);
  };

  const handleMouseMove = (e) => {
    const xOffset = e.clientX + 150 > window.innerWidth ? -160 : 10;
    const yOffset = e.clientY + 100 > window.innerHeight ? -110 : 10;
    setHoverPosition({ x: e.clientX + xOffset, y: e.clientY + yOffset });
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen text-white text-center p-6 ${isTextHovered ? '' : 'bg-gradient-to-b from-black via-gray-900 to-black'}`}>
      <video
        ref={videoRef}
        className={`absolute top-0 left-0 w-full h-full object-cover -z-10 ${isTextHovered ? 'visible' : 'invisible'}`}
        src="/videos/jll.mp4"
        autoPlay
        loop
        muted
        style={{ marginBottom: '20px' }} 
      />
      <div
        className="relative textImage-container cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <TextImage />
        {isHovered && (
          <div
            className="absolute p-2 bg-gray-800 rounded-md text-xs text-gray-300"
            style={{ top: hoverPosition.y, left: hoverPosition.x }}
          >
            <p>🎧 <strong>Click Controls:</strong></p>
            <ul className="mt-1 text-gray-400">
              <li>🔹 <strong>1 Click</strong> → Play / Pause</li>
              <li>🔹 <strong>2 Clicks</strong> → Next Track</li>
              <li>🔹 <strong>3 Clicks</strong> → Previous Track</li>
            </ul>
          </div>
        )}
      </div>

      <p
        className={`mt-6 text-2xl italic animate-pulse cursor-pointer ${styles.magicalText}`}
        onMouseEnter={() => setIsTextHovered(true)}
        onMouseLeave={() => setIsTextHovered(false)}
        onClick={handleClick}
        style={{ userSelect: 'none' }}
      >
        "Every moment with you is a beautiful memory."
      </p>

      <audio ref={audioRef} autoPlay />

      <p className="mt-4 text-lg font-semibold">
        {hasStarted ? (
          isPlaying ? (
            <span>
              <span style={{ color: 'blue' }}>🎵</span> Now Playing: {tracks[currentTrack].title}
            </span>
          ) : (
            "⏸️ Paused"
          )
        ) : (
          "🎵 Click the photo or quote to start the music"
        )}
      </p>
    </div>
  );
};

export default Home;