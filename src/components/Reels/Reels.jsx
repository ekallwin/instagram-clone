import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faComment, faVolumeUp, faVolumeMute, faMusic, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import './Reels.css';
import Bottomnav from '../Bottomnav/Bottomnav';

const keywords = ["food", "beach", "animals"];

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState({});
  const [videoCounts, setVideoCounts] = useState({});
  const videoRefs = useRef([]);
  const [showTapPopup, setShowTapPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTapPopup(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);


  const getRandomCount = () => {
    const count = Math.floor(Math.random() * 10000) + 100;
    if (count < 1000) return count.toString();
    return (count / 1000).toFixed(1) + 'k';
  };

  useEffect(() => {
    const fetchVideosForKeyword = async (keyword) => {
      try {
        const response = await axios.get(
          `https://api.pexels.com/videos/search?query=${keyword}&per_page=50`,
          { headers: { Authorization: import.meta.env.VITE_PEXELS_API_KEY } }
        );
        return response.data.videos.map(v => ({
          ...v,
          keyword,
          avatarUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`
        }));
      } catch (e) {
        console.error("Error fetching videos:", e);
        return [];
      }
    };

    const fetchAllVideos = async () => {
      let videoGroups = await Promise.all(keywords.map(fetchVideosForKeyword));

      videoGroups = videoGroups.map(group =>
        group.sort(() => Math.random() - 0.5)
      );

      let interleaved = [];
      let maxPerGroup = Math.max(...videoGroups.map(g => g.length));
      for (let i = 0; i < maxPerGroup; ++i) {
        for (let g = 0; g < videoGroups.length; ++g) {
          if (videoGroups[g][i]) interleaved.push(videoGroups[g][i]);
        }
      }

      const initialCounts = {};
      interleaved.forEach(video => {
        initialCounts[video.id] = {
          likes: getRandomCount(),
          comments: getRandomCount()
        };
      });

      setVideoCounts(initialCounts);
      setVideos(interleaved);
      setLoading(false);
    };

    fetchAllVideos();
  }, []);

  const handleScroll = async (e) => {
    const { scrollTop, clientHeight } = e.currentTarget;
    const currentIndex = Math.round(scrollTop / clientHeight);

    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });

    if (videoRefs.current[currentIndex]) {
      try {
        await videoRefs.current[currentIndex].play();
      } catch (err) {
      }
    }
  };

  const toggleMute = async () => {
    const currentIndex = Math.round(
      document.querySelector('.reels-scroll-container').scrollTop / window.innerHeight
    );
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    try {
      if (muted) {
        currentVideo.muted = false;
        await currentVideo.play();
      } else {
        currentVideo.muted = true;
      }
      setMuted(!muted);
    } catch (err) {
      console.log("Mute toggle failed:", err);
    }
  };


  const toggleLike = (videoId) => {
    const wasLiked = likedVideos[videoId];

    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));

    setVideoCounts(prev => {
      const currentCount = prev[videoId].likes;
      let numericValue = typeof currentCount === 'string' ?
        parseFloat(currentCount.replace('k', '')) * 1000 :
        parseInt(currentCount);

      if (wasLiked) {
        numericValue = Math.max(0, numericValue - 1);
      } else {
        numericValue += Math.floor(Math.random() * 90) + 10;
      }

      return {
        ...prev,
        [videoId]: {
          ...prev[videoId],
          likes: numericValue < 1000 ? numericValue.toString() : (numericValue / 1000).toFixed(1) + 'k'
        }
      };
    });
  };

  return (
    <>
      <div className="reels-container">
        {loading ? (
          <div className="loading"></div>
        ) : (
          <div className="reels-scroll-container" onScroll={handleScroll}>
            {videos.map((video, index) => {
              const videoFile = video.video_files.find(
                file => file.quality === 'hd' && file.file_type === 'video/mp4'
              ) || video.video_files[0];

              const isLiked = likedVideos[video.id] || false;
              const likeCount = videoCounts[video.id]?.likes || '0';
              const commentCount = videoCounts[video.id]?.comments || '0';

              return (
                <div key={`${video.id}-${video.keyword}`} className="reel-video-container">
                  <div className="reel-header-text">Reels</div>
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={videoFile.link}
                    className="reel-video"
                    autoPlay={index === 0}
                    loop
                    muted={muted}
                    playsInline
                    onClick={toggleMute}
                  />
                  <div className="reel-sidebar">
                    <div className="icon-button" onClick={() => toggleLike(video.id)}>
                      <FontAwesomeIcon
                        icon={isLiked ? solidHeart : farHeart}
                        className="icon"
                        style={{ color: isLiked ? '#ff3040' : '#fff' }}
                      />
                      <span className="icon-text">{likeCount}</span>
                    </div>
                    <div className="icon-button">
                      <FontAwesomeIcon icon={faComment} className="icon" />
                      <span className="icon-text">{commentCount}</span>
                    </div>
                    <div className="icon-button">
                      <FontAwesomeIcon icon={faPaperPlane} className="icon" />
                      <span className="icon-text">Share</span>
                    </div>
                    <div className="icon-button" onClick={toggleMute}>
                      <FontAwesomeIcon
                        icon={muted ? faVolumeMute : faVolumeUp}
                        className="icon"
                      />
                    </div>
                    <div className="user-avatar">
                      <img
                        src={video.avatarUrl}
                        alt="User"
                        className="avatar-image"
                      />
                    </div>
                  </div>
                  <div className="reel-bottom-bar">
                    <div className="user-info">
                      <span className="description">Check out this amazing #{video.keyword} video!</span>
                    </div>
                    <div className="music-info">
                      <FontAwesomeIcon icon={faMusic} className="music-icon" />
                      <span className="music-text">Original Sound</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showTapPopup && (
        <div className="tap-popup">
          Tap for sound
        </div>
      )}

      <Bottomnav />
    </>
  );
};

export default Reels;