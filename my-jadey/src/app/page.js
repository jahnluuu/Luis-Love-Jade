"use client";

import { useState, useRef, useEffect } from "react";
import TextImage from "./pages/textImage";
import styles from './styles/Home.module.css';

const Home = () => {
  const audioRef = useRef(null);
  const videoRefs = useRef([]); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); 
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); 
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(false);
  const [countdown, setCountdown] = useState(15);

  const tracks = [
    { title: "Co-Pilot", src: "/music/CoPilot.mp3" },
    { title: "Oksihina", src: "/music/Oksihina.mp3" },
    { title: "Til' Death Do Us Part", src: "/music/TilDeathDoUsPart.mp3" },
    { title: "Mahika", src: "/music/Mahika.mp3" },
    { title: "Tahanan", src: "/music/Tahanan.mp3" },
    { title: "Paraluman", src: "/music/Paraluman.mp3" },
    { title: "Sining", src: "/music/Sining.mp3" },
    { title: "Museo", src: "/music/Museo.mp3" },
    { title: "No Promises", src: "/music/NoPromises.mp3" },
  ];

  const videos = [
    { title: "Video 1", src: "/videos/03225.mp4" },
  ];

  const trimmedTracks = {
    "Mahika": 18,  
    "Co-Pilot": 3,  
    "Til' Death Do Us Part": 5,
    "Sinig": 12,
    "Museo": 3,
    "Tahanan": 6,
    "Paraluman": 2,
  };

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
  
    const handleTimeUpdate = () => {
      if (audioRef.current && !isNaN(audioRef.current.duration)) {
        const track = tracks[currentTrack];
        const trimTime = trimmedTracks[track.title] || 0;
        const stopTime = audioRef.current.duration - trimTime;
  
        if (stopTime > 0 && audioRef.current.currentTime >= stopTime) {
          audioRef.current.pause();
          setIsPlaying(false);
  
          setTimeout(handleTrackEnd, 500);
        }
      }
    };
  
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleTrackEnd);
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleTrackEnd);
      }
    };
  }, [currentTrack, tracks]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setShowModal(true);
      setShowInfoButton(true);
    }
  }, []);

  useEffect(() => {
    const setRandomStartTime = () => {
      if (videoRefs.current[currentVideo] && videoRefs.current[currentVideo].duration) {
        const randomTime = Math.floor(Math.random() * videoRefs.current[currentVideo].duration);
        videoRefs.current[currentVideo].currentTime = randomTime;
      }
    };

    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(randomVideoIndex);

    if (videoRefs.current[randomVideoIndex]) {
      videoRefs.current[randomVideoIndex].addEventListener('loadedmetadata', setRandomStartTime);
    }

    return () => {
      if (videoRefs.current[randomVideoIndex]) {
        videoRefs.current[randomVideoIndex].removeEventListener('loadedmetadata', setRandomStartTime);
      }
    };
  }, []); 

  useEffect(() => {
    const handleVideoEnd = () => {
      setCurrentVideo((prev) => (prev + 1) % videos.length); 
    };

    if (videoRefs.current[currentVideo]) {
      videoRefs.current[currentVideo].addEventListener("ended", handleVideoEnd);
      videoRefs.current[currentVideo].play();
    }

    return () => {
      if (videoRefs.current[currentVideo]) {
        videoRefs.current[currentVideo].removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [currentVideo]);

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

  const handleTouchStart = (e) => {
    e.preventDefault(); 
    setIsTextHovered(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  
    e.target.classList.add("active");
  
    if (videoRefs.current[currentVideo]) {
      videoRefs.current[currentVideo].play();
    }
  };
  
  const handleTouchEnd = (e) => {
    setIsTextHovered(false);
  
    e.target.classList.remove("active");
  
    if (videoRefs.current[currentVideo]) {
      videoRefs.current[currentVideo].pause();
    }
  };
  
  useEffect(() => {
    if (showModal) {
      setCountdown(15); 
  
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowModal(false); 
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); 
  
      return () => clearInterval(timer);
    }
  }, [showModal]);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen text-white text-center p-6 ${isTextHovered ? '' : 'bg-gradient-to-b from-black via-gray-900 to-black'} sm:p-4`}>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl text-black text-center max-w-sm mx-auto shadow-2xl transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              📱 Best Viewed on Desktop
            </h2>
            <p className="mb-4 text-sm text-gray-700">
              For the best experience, please use a desktop.  
              However, on mobile you can try rotating your device to landscape mode.
            </p>
            <ul className="text-left text-gray-600 text-sm mb-4 space-y-2">
              <li>👉 <strong>Tap</strong> the quote to play/pause music.</li>
              <li>👉 <strong>Double Tap</strong> the quote to next music.</li>
              <li>👉 <strong>Hold</strong> the quote to play the video.</li>
              
            </ul>
            <p className="text-gray-500 text-xs mb-3">
              Auto-closing in <span className="font-semibold text-red-500">{countdown}s</span> ⏳
            </p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg w-full font-semibold transition-transform transform active:scale-95 hover:opacity-90"
              onClick={closeModal}
            >
              Got it! 🚀
            </button>
          </div>
        </div>
      )}

      {showInfoButton && (
        <button
          className="fixed top-6 right-6 bg-none text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-transform transform active:scale-95 hover:opacity-90"
          onClick={() => setShowModal(true)}
        >
          ℹ️
        </button>
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
        {videos.map((video, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            className={`absolute top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-500 ${
              currentVideo === index ? "opacity-100 visible" : "opacity-0 invisible"
            } sm:h-auto sm:w-auto responsive-video`}
            src={video.src}
            muted
            playsInline
            style={{ transform: 'rotate(0deg)', maxHeight: '96vh', height: 'auto', width: '100vw' }}
          />
        ))}
        <TextImage />
        {isHovered && (window.innerWidth > 900 || window.innerHeight < window.innerWidth) && (
          <div
            className="absolute p-2 bg-gray-800 rounded-md text-xs text-gray-300"
            style={{ top: hoverPosition.y, left: hoverPosition.x }}
          >
            <p>🎧 <strong>Click Controls:</strong></p>
            <ul className="mt-1 text-gray-400">
              <li>🔹 <strong>1 Click</strong> → Play / Pause</li>
              <li>🔹 <strong>2 Clicks</strong> → Next Track</li>
            </ul>
          </div>
        )}
      </div>

      <p
        className={`mt-6 text-2xl italic animate-pulse cursor-pointer ${styles.magicalText} sm:text-xl`}
        onMouseEnter={() => setIsTextHovered(true)}
        onMouseLeave={() => setIsTextHovered(false)}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ userSelect: 'none', touchAction: 'none' }} 
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