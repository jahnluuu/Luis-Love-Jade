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
  const [showModal, setShowModal] = useState(false);

  const tracks = [
    { title: "Co-Pilot", src: "/music/CoPilot.mp3" },
    { title: "Til' Death Do Us Part", src: "/music/TilDeathDoUsPart.mp3" },
    { title: "Mahika", src: "/music/Mahika.mp3" },
    { title: "Paraluman", src: "/music/Paraluman.mp3" },
    { title: "Sining", src: "/music/Sining.mp3" },
    { title: "Museo", src: "/music/Museo.mp3" },
    { title: "No Promises", src: "/music/NoPromises.mp3" },
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

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const setRandomStartTime = () => {
      if (videoRef.current && videoRef.current.duration) {
        const randomTime = Math.floor(Math.random() * videoRef.current.duration);
        videoRef.current.currentTime = randomTime;
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', setRandomStartTime);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', setRandomStartTime);
      }
    };
  }, []);

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

  const handleTextImageClick = () => {
    if (window.innerWidth <= 768) {
      setIsHovered(!isHovered);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen text-white text-center p-6 ${isTextHovered ? '' : 'bg-gradient-to-b from-black via-gray-900 to-black'} sm:p-4`}>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg text-black text-center max-w-xs mx-auto">
            <h2 className="text-lg font-bold mb-2">Better Viewed on Desktop</h2>
            <p className="mb-4 text-sm">For the best experience, please view this website on a desktop.</p>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div
        className="relative textImage-container cursor-pointer flex items-center justify-center"
        onClick={(e) => {
          handleClick(e);
          handleTextImageClick(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          className={`absolute top-0 left-0 w-full h-full object-cover -z-10 ${isTextHovered ? 'visible' : 'invisible'} sm:h-auto sm:w-auto responsive-video`}
          src="/videos/03223.mp4"
          autoPlay
          loop
          muted
          style={{ transform: 'rotate(0deg)', maxHeight:'96vh', height: 'auto', width: '100vw' }} 

        />
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
        className={`mt-6 text-2xl italic animate-pulse cursor-pointer ${styles.magicalText} sm:text-xl`}
        onMouseEnter={() => setIsTextHovered(true)}
        onMouseLeave={() => setIsTextHovered(false)}
        onClick={handleClick}
        style={{ userSelect: 'none' }}
      >
        "Every moment with you is a beautiful memory."
      </p>

      <audio ref={audioRef} autoPlay />

      <p className="mt-4 text-lg font-semibold sm:text-base">
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