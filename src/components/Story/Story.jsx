import React, { useEffect, useRef, useState } from 'react';
import Verified from '../Profileverified/Verified';
import './Story.css';
import { FaHeart, FaRegHeart, FaPaperPlane, FaRegComment } from 'react-icons/fa';

function StoryModal({
    stories,
    currentStoryIndex,
    activeStory,
    profile,
    onClose,
    onNext,
    onPrev,
    onClickProfile
}) {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [likedStories, setLikedStories] = useState({});
    const modalRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const remainingTimeRef = useRef(5000);
    const lastUpdateRef = useRef(Date.now());
    const messageInputRef = useRef(null);

    useEffect(() => {
        if (activeStory && !likedStories.hasOwnProperty(activeStory.id)) {
            setLikedStories(prev => ({
                ...prev,
                [activeStory.id]: activeStory.isLiked || false
            }));
        }
    }, [activeStory]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                onNext();
            } else if (e.key === 'ArrowLeft') {
                onPrev();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev, onClose]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        if (!activeStory) return;

        const startAnimation = () => {
            cancelAnimationFrame(animationRef.current);
            startTimeRef.current = Date.now();
            lastUpdateRef.current = Date.now();

            const animate = () => {
                if (isPaused) {
                    const now = Date.now();
                    const elapsedPause = now - lastUpdateRef.current;
                    remainingTimeRef.current -= elapsedPause;
                    lastUpdateRef.current = now;
                    animationRef.current = requestAnimationFrame(animate);
                    return;
                }

                const elapsed = Date.now() - startTimeRef.current;
                const newProgress = Math.min((elapsed / remainingTimeRef.current) * 100, 100);

                setProgress(newProgress);

                if (newProgress < 100) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    goToNextStory();
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        };

        startAnimation();
        return () => cancelAnimationFrame(animationRef.current);
    }, [activeStory, isPaused]);

    const goToNextStory = () => {
        remainingTimeRef.current = 5000;
        onNext();
    };

    const handleTouchStart = () => {
        setIsPaused(true);
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
        startTimeRef.current = Date.now() - (5000 * (progress / 100));
    };

    const handleLikeClick = () => {
        if (!activeStory) return;

        setLikedStories(prev => {
            const newState = {
                ...prev,
                [activeStory.id]: !prev[activeStory.id]
            };


            return newState;
        });
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessage('');
        }
        messageInputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!activeStory) return null;

    const isCurrentStoryLiked = likedStories[activeStory.id] || false;

    return (
        <div
            className="story-modal-overlay"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
        >
            <div className="story-modal" ref={modalRef}>
                <div className="story-header">
                    <div
                        className="story-user-info clickable-profile"
                        onClick={onClickProfile}
                    >
                        <img
                            src={profile?.avatar || activeStory.avatar}
                            alt={profile?.username || activeStory.username}
                            className="story-avatar"
                        />
                        <span className="user-info-1">
                            <span className="username-1">
                                {profile?.username || activeStory.username}
                                {(profile?.isVerified || activeStory.isVerified) && (
                                    <>&nbsp;<Verified /></>
                                )}
                                <span className="story-timestamp" style={{ color: '#ccc', fontSize: '11px', marginLeft: '10px' }}>{activeStory.timestamp}</span>
                            </span>
                        </span>
                    </div>
                    <button className="close-story" onClick={onClose}>×</button>
                </div>

                <div className="story-content">
                    <img
                        src={activeStory.image}
                        alt={`Story by ${profile?.username || activeStory.username}`}
                        className="full-story-image"
                    />
                </div>

                <div className="story-nav">
                    <div className="story-nav-prev" onClick={onPrev}></div>
                    <div className="story-nav-next" onClick={onNext}></div>
                </div>

                <div className="story-progress-container">
                    {stories.map((_, index) => (
                        <div key={index} className="story-progress-bar">
                            <div
                                className="story-progress-fill"
                                style={{
                                    width: index < currentStoryIndex ? '100%' :
                                        index === currentStoryIndex ? `${progress}%` : '0%',
                                    transition: index === currentStoryIndex ? 'width 0.05s linear' : 'none'
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="story-footer">
                    <div className="story-actions">
                        <FaRegComment style={{ color: 'white' }} />
                        <div className="story-action-input">
                            <input
                                type="text"
                                placeholder="Send message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                ref={messageInputRef}
                            />
                            <button
                                className={`story-send-button ${message.trim() ? 'active' : ''}`}
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                            >
                            </button>
                        </div>

                        <div className="story-action-icons">
                            <button
                                className={`story-action-button ${isCurrentStoryLiked ? 'liked' : ''}`}
                                onClick={handleLikeClick}
                            >
                                {isCurrentStoryLiked ? (
                                    <FaHeart style={{ color: 'red' }} />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>
                            <FaPaperPlane style={{ color: 'white' }} />

                        </div>
                    </div>
                </div>

                {isPaused && (
                    <div className="pause-indicator"></div>
                )}
            </div>
        </div>
    );
}

export default StoryModal;