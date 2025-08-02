import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { loadProfiles } from '../data/dataLoader';
import './Stories.css';
import Verified from '../Profileverified/Verified';
import Story from '../Story/Story';

function Stories() {
    const [activeStory, setActiveStory] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const navigate = useNavigate();
    const [allStories, setAllStories] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [currentUserStories, setCurrentUserStories] = useState([]);
    const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [viewedStories, setViewedStories] = useState([]);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        async function fetchStories() {
            try {
                const data = await loadProfiles();
                setProfiles(data);
                const extractedStories = data.reduce((stories, user) => {
                    if (user.stories?.length > 0) {
                        const userStories = user.stories.map(story => ({
                            ...story,
                            username: user.username,
                            avatar: user.avatar,
                            isYourStory: user.isYourStory || false,
                            userId: user.id,
                            isVerified: user.isVerified
                        }));
                        return [...stories, ...userStories];
                    }
                    return stories;
                }, []);
                setAllStories(extractedStories);
            } catch (error) {
                console.error("Failed to load stories:", error);
            }
        }

        fetchStories();
    }, []);

    const startProgressAnimation = () => {
        cancelAnimationFrame(animationRef.current);
        setProgress(0);
        startTimeRef.current = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / 10000) * 100, 100);
            setProgress(newProgress);

            if (newProgress < 100) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                goToNextStory();
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const handleStoryClick = (story, index) => {
        const userStories = allStories.filter(s => s.userId === story.userId);
        const userStoryIndex = userStories.findIndex(s => s.id === story.id);

        setCurrentUserStories(userStories);
        setCurrentUserStoryIndex(userStoryIndex);
        setActiveStory(story);
        setCurrentStoryIndex(index);
        startProgressAnimation();

        if (!viewedStories.includes(story.id)) {
            setViewedStories([...viewedStories, story.id]);
        }
    };

    const closeStory = () => {
        cancelAnimationFrame(animationRef.current);
        setActiveStory(null);
    };

    const goToNextStory = () => {
        cancelAnimationFrame(animationRef.current);

        if (currentUserStoryIndex < currentUserStories.length - 1) {
            const nextIndex = currentUserStoryIndex + 1;
            const nextStory = currentUserStories[nextIndex];
            const globalIndex = allStories.findIndex(s => s.id === nextStory.id);

            setCurrentUserStoryIndex(nextIndex);
            setCurrentStoryIndex(globalIndex);
            setActiveStory(nextStory);
            startProgressAnimation();

            if (!viewedStories.includes(nextStory.id)) {
                setViewedStories([...viewedStories, nextStory.id]);
            }
        }
        else if (currentStoryIndex < allStories.length - 1) {
            const nextUserFirstStory = allStories[currentStoryIndex + 1];
            const nextUserStories = allStories.filter(s => s.userId === nextUserFirstStory.userId);
            const globalIndex = allStories.findIndex(s => s.id === nextUserFirstStory.id);

            setCurrentUserStories(nextUserStories);
            setCurrentUserStoryIndex(0);
            setCurrentStoryIndex(globalIndex);
            setActiveStory(nextUserFirstStory);
            startProgressAnimation();

            if (!viewedStories.includes(nextUserFirstStory.id)) {
                setViewedStories([...viewedStories, nextUserFirstStory.id]);
            }
        }
        else {
            closeStory();
        }
    };

    const goToPrevStory = () => {
        cancelAnimationFrame(animationRef.current);

        if (currentUserStoryIndex > 0) {
            const prevIndex = currentUserStoryIndex - 1;
            const prevStory = currentUserStories[prevIndex];
            const globalIndex = allStories.findIndex(s => s.id === prevStory.id);

            setCurrentUserStoryIndex(prevIndex);
            setCurrentStoryIndex(globalIndex);
            setActiveStory(prevStory);
            startProgressAnimation();
        }
        else if (currentStoryIndex > 0) {
            const prevUserLastStory = allStories[currentStoryIndex - 1];
            const prevUserStories = allStories.filter(s => s.userId === prevUserLastStory.userId);
            const prevUserStoryIndex = prevUserStories.length - 1;
            const globalIndex = allStories.findIndex(s => s.id === prevUserStories[prevUserStoryIndex].id);

            setCurrentUserStories(prevUserStories);
            setCurrentUserStoryIndex(prevUserStoryIndex);
            setCurrentStoryIndex(globalIndex);
            setActiveStory(prevUserStories[prevUserStoryIndex]);
            startProgressAnimation();
        }
    };

    const handleProfileClick = (username, e) => {
        e.stopPropagation();
        closeStory();
        navigate(`/user/${username}`);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            goToNextStory();
        } else if (touchEndX.current - touchStartX.current > 50) {
            goToPrevStory();
        }
    };

    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <>
            <div className="stories-container">
                <div className="stories-scrollable">
                    {profiles.map((user) => {
                        if (user.stories?.length > 0) {
                            const firstStory = user.stories[0];
                            const storyIndex = allStories.findIndex(s => s.id === firstStory.id);
                            const isViewed = viewedStories.includes(firstStory.id);

                            return (
                                <div
                                    key={user.id}
                                    className={`story ${isViewed ? 'story-viewed' : ''}`}
                                    onClick={() => handleStoryClick({
                                        ...firstStory,
                                        username: user.username,
                                        avatar: user.avatar,
                                        isYourStory: user.isYourStory || false,
                                        userId: user.id,
                                        isVerified: user.isVerified
                                    }, storyIndex)}
                                >
                                    <div className={`story-borders ${user.isYourStory ? 'your-story' : ''}`}>
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="story-image"
                                        />
                                        {user.isYourStory && <div className="add-storys">+</div>}
                                    </div>
                                    <span className="story-username">
                                        {user.isYourStory ? 'Your story' : user.username}
                                        {user.isVerified && <span>&nbsp;<Verified /></span>}
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            {activeStory && (
                <Story
                    stories={currentUserStories}
                    currentStoryIndex={currentUserStoryIndex}
                    activeStory={activeStory}
                    profile={profiles.find(p => p.id === activeStory.userId)}
                    onClose={closeStory}
                    onNext={goToNextStory}
                    onPrev={goToPrevStory}
                    progress={progress}
                    onClickProfile={(e) => handleProfileClick(activeStory.username, e)}
                />
            )}
        </>
    );
}

export default Stories;