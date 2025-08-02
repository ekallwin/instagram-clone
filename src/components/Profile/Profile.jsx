import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import Verified from '../Profileverified/Profileverified';
import Story from '../Story/Story';
import { loadProfiles } from '../data/dataLoader';
import Bottomnav from '../Bottomnav/Bottomnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart as solidHeart, faBookmark as solidBookmark, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark, faComment } from '@fortawesome/free-regular-svg-icons';
import CommentModel from '../Commentmodel/Commentmodel';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeStory, setActiveStory] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [viewedStories, setViewedStories] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [commentInputs, setCommentInputs] = useState({});
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = () => {
        setIsFollowing(!isFollowing);
        setProfile(prev => ({
            ...prev,
            followers: isFollowing ? prev.followers - 1 : prev.followers + 1
        }));
    };
    const handleMessageClick = () => {
        navigate(`/chat/${username}`);
    };

    const handleLike = (postId) => {
        setProfile(prev => ({
            ...prev,
            posts: prev.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            })
        }));

        if (showCommentsModal && currentPost?.id === postId) {
            setCurrentPost(prev => ({
                ...prev,
                isLiked: !prev.isLiked,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
            }));
        }
    };
    const viewPost = (post) => {
        navigate(`/user/${username}/post/${post.id}`);
    }

    const handleSave = (postId) => {
        setProfile(prev => ({
            ...prev,
            posts: prev.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isSaved: !post.isSaved
                    };
                }
                return post;
            })
        }));

        if (showCommentsModal && currentPost?.id === postId) {
            setCurrentPost(prev => ({
                ...prev,
                isSaved: !prev.isSaved
            }));
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentInputs({
            ...commentInputs,
            [postId]: text
        });
    };

    const handleAddComment = (postId) => {
        if (!commentInputs[postId]?.trim()) return;
        const newComment = {
            id: Date.now(),
            username: 'current_user',
            text: commentInputs[postId],
            timestamp: 'Just now'
        };

        setProfile(prev => ({
            ...prev,
            posts: prev.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [...post.comments, newComment]
                    };
                }
                return post;
            })
        }));

        if (showCommentsModal && currentPost?.id === postId) {
            setCurrentPost(prev => ({
                ...prev,
                comments: [...prev.comments, newComment]
            }));
        }

        setCommentInputs({
            ...commentInputs,
            [postId]: ''
        });
    };

    const toggleComments = (post) => {
        if (showCommentsModal && currentPost?.id === post.id) {
            setShowCommentsModal(false);
            setCurrentPost(null);
        } else {
            setCurrentPost(post);
            setShowCommentsModal(true);
        }
    };

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
        if (profile.stories?.length > 0) {
            setActiveStory(profile.stories[0]);
            setCurrentStoryIndex(0);
            startProgressAnimation();
            markStoryAsViewed(profile.stories[0].id);
        }
    };

    const markStoryAsViewed = (storyId) => {
        if (!viewedStories.includes(storyId)) {
            setViewedStories([...viewedStories, storyId]);
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
            setActiveStory(profile.stories[nextIndex]);
            markStoryAsViewed(profile.stories[nextIndex].id);
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
            setActiveStory(profile.stories[prevIndex]);
            startProgressAnimation();
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadProfiles();
                const user = data.find(p => p.username === username);
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
                <div onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /></div>

                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <div
                            className={`profile-avatar-wrapper ${profile.stories?.length > 0 ? 'has-story' : ''} ${profile.stories?.some(s => !viewedStories.includes(s.id)) ? 'unseen-story' : 'story-viewed'}`}
                            onClick={handleStoryClick}
                        >
                            <img src={profile.avatar} alt={profile.username} className="profile-avatar" />
                            {profile.stories?.length > 0 && !profile.stories?.some(s => !viewedStories.includes(s.id)) && (
                                <div className="story-viewed-indicator"></div>
                            )}
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-username-row">
                            <h2 className="profile-username">
                                {profile.username}
                                {profile.isVerified && <Verified />}
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
                            <button
                                className={`btn ${isFollowing ? 'btn-light' : 'btn-primary'}`}
                                onClick={handleClick}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <button className='btn btn-light' onClick={handleMessageClick}>Message</button>
                        </div>
                    </div>
                </div>

                {activeStory && (
                    <Story
                        stories={profile.stories}
                        currentStoryIndex={currentStoryIndex}
                        activeStory={activeStory}
                        profile={profile}
                        onClose={closeStory}
                        onNext={goToNextStory}
                        onPrev={goToPrevStory}
                        progress={progress}
                        onClickProfile={() => { }}
                    />
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
                                <div key={post.id} className="post-thumbnail" onClick={() => viewPost(post)}>
                                    <img src={post.image} alt={`Post by ${profile.username}`} />
                                    <div className="post-thumbnail-overlay">
                                        <span>
                                            <FontAwesomeIcon icon={post.isLiked ? solidHeart : regularHeart} />
                                            {post.likes.toLocaleString()}
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faComment} />
                                            {post.comments.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-posts">
                            <div className="no-posts-icon">
                                <svg aria-label="Camera" fill="#262626" height="48" viewBox="0 0 48 48" width="48">
                                    <path d="M24 32.2c4.3 0 7.8-3.5 7.8-7.8 0-4.3-3.5-7.8-7.8-7.8-4.3 0-7.8 3.5-7.8 7.8 0 4.3 3.5 7.8 7.8 7.8zm12.7-18.3v21.5c0 1.4-1.1 2.5-2.5 2.5h-20.4c-1.4 0-2.5-1.1-2.5-2.5v-21.5c0-1.4 1.1-2.5 2.5-2.5h5.7l1.9-2.2h7.3l1.9 2.2h5.7c1.4 0 2.5 1.1 2.5 2.5zm-15.7 18.3c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11z"></path>
                                </svg>
                            </div>
                            <h2>No Posts Yet</h2>
                        </div>
                    )}
                </div>
            </div>
            <Bottomnav />

            {showCommentsModal && currentPost && (
                <CommentModel
                    post={currentPost}
                    onClose={() => setShowCommentsModal(false)}
                    onLike={handleLike}
                    onSave={handleSave}
                    commentInput={commentInputs[currentPost.id]}
                    onCommentChange={handleCommentChange}
                    onAddComment={handleAddComment}
                />
            )}
        </>
    );
}

export default Profile;