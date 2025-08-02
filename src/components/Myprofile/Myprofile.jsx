import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import './Myprofile.css';
import Verified from '../Profileverified/Profileverified';
import Bottomnav from '../Bottomnav/Bottomnav';
import { loadProfiles } from '../data/dataLoader';

function MyProfile() {

    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStory, setActiveStory] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const navigate = useNavigate();
    const startProgressAnimation = () => {
        cancelAnimationFrame(animationRef.current);
        setProgress(0);
        startTimeRef.current = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / 5000) * 100, 100);
            setProgress(newProgress);

            if (newProgress < 100) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                goToNextStory();
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const handleStoryClick = () => {
        if (profile.stories && profile.stories.length > 0) {
            setActiveStory({
                ...profile.stories[0],
                username: profile.username,
                avatar: profile.avatar,
                isYourStory: profile.isYourStory,
                isVerified: profile.isVerified
            });
            setCurrentStoryIndex(0);
            startProgressAnimation();
        }
    };

    const closeStory = () => {
        cancelAnimationFrame(animationRef.current);
        setActiveStory(null);
    };

    const goToNextStory = () => {
        cancelAnimationFrame(animationRef.current);
        if (profile.stories && currentStoryIndex < profile.stories.length - 1) {
            const nextIndex = currentStoryIndex + 1;
            setCurrentStoryIndex(nextIndex);
            setActiveStory({
                ...profile.stories[nextIndex],
                username: profile.username,
                avatar: profile.avatar,
                isYourStory: profile.isYourStory,
                isVerified: profile.isVerified
            });
            startProgressAnimation();
        } else {
            closeStory();
        }
    };

    const goToPrevStory = () => {
        cancelAnimationFrame(animationRef.current);
        if (currentStoryIndex > 0) {
            const prevIndex = currentStoryIndex - 1;
            setCurrentStoryIndex(prevIndex);
            setActiveStory({
                ...profile.stories[prevIndex],
                username: profile.username,
                avatar: profile.avatar,
                isYourStory: profile.isYourStory,
                isVerified: profile.isVerified
            });
            startProgressAnimation();
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadProfiles();
                const user = data.find(p => p.isYourStory);
                setProfile(user || null);
            } catch (err) {
                console.error('Failed to load profile:', err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [username]);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div className="profile-not-found">
        <h4>Sorry, this page isn't available</h4> <br />
        <p style={{ fontSize: '15px' }} className="text-center">The link you followed may be broken, or the page may have been removed</p>
    </div>;

    return (
        <>
            <div className="profile-container">
                <div onClick={() => navigate('/')}><FontAwesomeIcon icon={faArrowLeft} /></div>

                <div className="profile-header">

                    <div className="profile-avatar-container">
                        <div
                            className={`profile-avatar-wrapper ${profile.stories?.length > 0 ? 'has-story' : ''}`}
                            onClick={handleStoryClick}
                        >
                            <div className={`story-border ${profile.isYourStory ? 'your-story' : ''}`}>
                                <img src={profile.avatar} alt={profile.username} className="profile-avatar" />
                                {profile.isYourStory && <div className="add-story">+</div>}
                            </div>
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-username-row">
                            <h2 className="profile-username">
                                {profile.username}
                                {profile.isVerified && (
                                    <>
                                        &nbsp;
                                        <Verified />
                                    </>
                                )}
                            </h2>
                        </div>
                        <div className="profile-stats">
                            <div className="profile-stat">
                                <span className="stat-count">{profile.postsCount}</span>
                                <span className="stat-label">posts</span>
                            </div>
                            <div className="profile-stat">
                                <span className="stat-count">{profile.followers.toLocaleString()}</span>
                                <span className="stat-label">followers</span>
                            </div>
                            <div className="profile-stat">
                                <span className="stat-count">{profile.following.toLocaleString()}</span>
                                <span className="stat-label">following</span>
                            </div>
                        </div>
                        <div className="profile-bio">
                            <h2 className="profile-fullname">{profile.fullName}</h2>
                            <p>{profile.bio}</p>
                        </div>
                        <div className='profile-button'>
                            <button className='btn btn-light'>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {activeStory && (
                    <div className="story-modal">
                        <div className="story-header">
                            <div className="story-user-info">
                                <img
                                    src={profile.avatar}
                                    alt={profile.username}
                                    className="story-avatar"
                                />
                                <span>
                                    {profile.isYourStory ? 'Your story' : profile.username}
                                    {profile.isVerified && <>&nbsp;<Verified /></>}
                                </span>
                            </div>
                            <button className="close-story" onClick={closeStory}>×</button>
                        </div>

                        <div className="story-content">
                            <img
                                src={activeStory.image}
                                alt={`Story by ${profile.username}`}
                                className="full-story-image"
                            />
                            <div className="story-time">{activeStory.timestamp}</div>
                        </div>

                        <div className="story-nav">
                            <div className="story-nav-prev" onClick={goToPrevStory}></div>
                            <div className="story-nav-next" onClick={goToNextStory}></div>
                        </div>

                        <div className="story-progress-container">
                            {profile.stories.map((_, index) => (
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
                    </div>
                )}

                <div className="profile-tabs">
                    <button className="profile-tab active">
                        <svg aria-label="Posts" fill="#262626" height="12" viewBox="0 0 48 48" width="12">
                            <path d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z"></path>
                        </svg>
                        <span>POSTS</span>
                    </button>

                    <button className="profile-tab">
                        <svg aria-label="Tagged" fill="#8e8e8e" height="12" viewBox="0 0 48 48" width="12">
                            <path d="M41.5 5.5H30.4c-.5 0-1-.2-1.4-.6l-4-4c-.6-.6-1.5-.6-2.1 0l-4 4c-.4.4-.9.6-1.4.6h-11c-3.3 0-6 2.7-6 6v30c0 3.3 2.7 6 6 6h35c3.3 0 6-2.7 6-6v-30c0-3.3-2.7-6-6-6zm-29.4 39c-.6 0-1.1-.6-1-1.2.7-3.2 3.5-5.6 6.8-5.6h12c3.4 0 6.2 2.4 6.8 5.6.1.6-.4 1.2-1 1.2H12.1zm32.4-3c0 1.7-1.3 3-3 3h-.6c-5.5 0-10-4.5-10-10v-4c0-1.7 1.3-3 3-3s3 1.3 3 3v4c0 2.2 1.8 4 4 4s4-1.8 4-4v-12c0-1.7 1.3-3 3-3s3 1.3 3 3v12z"></path>
                        </svg>
                        <span>TAGGED</span>
                    </button>
                </div>

                <div className="profile-posts">
                    {profile.posts.length > 0 ? (
                        <div className="posts-grid">
                            {profile.posts.map(post => (
                                <div key={post.id} className="post-thumbnail">
                                    <img src={post.image} alt={`Post by ${profile.username}`} />
                                    <div className="post-thumbnail-overlay">
                                        <span>
                                            <svg aria-label="Like" fill="#ffffff" height="24" viewBox="0 0 48 48" width="24">
                                                <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                            </svg>
                                            {post.likes.toLocaleString()}
                                        </span>
                                        <span>
                                            <svg aria-label="Comment" fill="#ffffff" height="24" viewBox="0 0 48 48" width="24">
                                                <path d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"></path>
                                            </svg>
                                            {post.comments.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-posts">
                            <div className="no-posts-icon">
                                <svg aria-label="Camera" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><title>Camera</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                            </div>
                            <h2>No Posts Yet</h2>
                        </div>
                    )}
                </div>
            </div>
            <Bottomnav />
        </>
    );
}

export default MyProfile;