import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis, faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark } from '@fortawesome/free-regular-svg-icons';
import './Posts.css';
import { useEffect, useState } from 'react';
import { loadProfiles } from '../data/dataLoader';
import CommentModel from '../Commentmodel/Commentmodel';
import Verified from '../Profileverified/Verified';

function Posts() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadProfiles();
                setProfiles(data);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const [commentInputs, setCommentInputs] = useState({});
    const [currentPost, setCurrentPost] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);

    const allPosts = profiles.flatMap(profile =>
        profile.posts.map(post => ({ ...post, profile }))
    );

    const handleLike = (postId) => {
        setProfiles(profiles.map(profile => ({
            ...profile,
            posts: profile.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            })
        })));

        if (showCommentsModal && currentPost?.id === postId) {
            setCurrentPost(prev => ({
                ...prev,
                isLiked: !prev.isLiked,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
            }));
        }
    };

    const handleSave = (postId) => {
        setProfiles(profiles.map(profile => ({
            ...profile,
            posts: profile.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isSaved: !post.isSaved
                    };
                }
                return post;
            })
        })));

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
            username: 'andrew.lee',
            text: commentInputs[postId],
            timestamp: 'Just now'
        };

        setProfiles(profiles.map(profile => ({
            ...profile,
            posts: profile.posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [...post.comments, newComment]
                    };
                }
                return post;
            })
        })));

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

    const toggleComments = (postId) => {
        if (showCommentsModal && currentPost?.id === postId) {
            setShowCommentsModal(false);
            setCurrentPost(null);
        } else {
            const post = allPosts.find(p => p.id === postId);
            setCurrentPost(post);
            setShowCommentsModal(true);
        }
    };

    const navigateToProfile = (username) => {
        navigate(`/user/${username}`);
    };

    return (
        <div className="posts-feed">
            {allPosts.map(post => (
                <div key={post.id} className="post">
                    <div className="post-header">
                        <div style={{ display: 'flex' }}>
                            <div className="post-user-info" style={{ cursor: 'pointer' }} onClick={() => navigateToProfile(post.profile.username)}>
                                <img src={post.profile.avatar} alt={post.profile.username} className="post-avatar" />
                                <span className="post-username">
                                    {post.profile.username}
                                    {post.profile.isVerified && (
                                        <>
                                            &nbsp;
                                            <Verified />
                                        </>
                                    )}

                                </span>
                            </div>
                            <span className="post-timestamp">{post.timestamp}</span>
                        </div>
                        <FontAwesomeIcon icon={faEllipsis} className="post-options" />
                    </div>
                    <div className="post-image-container">
                        <img src={post.image} alt="Post" className="post-image" />
                    </div>
                    <div className="post-actions">
                        <div className="post-actions-left">
                            <FontAwesomeIcon
                                icon={post.isLiked ? solidHeart : regularHeart}
                                onClick={() => handleLike(post.id)}
                                style={{ color: post.isLiked ? '#FF3040' : '#000000' }}
                            />
                            <FontAwesomeIcon
                                icon={faComment}
                                className="comment-icon"
                                onClick={() => toggleComments(post.id)}
                            />
                            <FontAwesomeIcon icon={faPaperPlane} className="share-icon" />
                        </div>
                        <FontAwesomeIcon
                            icon={post.isSaved ? solidBookmark : faBookmark}
                            className="save-icon"
                            onClick={() => handleSave(post.id)}
                        />
                    </div>
                    <div className="post-likes">{post.likes.toLocaleString()} likes</div>
                    <div className="post-caption">
                        <span
                            className="caption-username"
                            onClick={() => navigateToProfile(post.profile.username)}
                            style={{ cursor: 'pointer' }}
                        >
                            {post.profile.username}
                        </span>
                        {post.caption}
                    </div>
                    <div className="post-caption post-comments-toggle" onClick={() => toggleComments(post.id)}>
                        View {post.comments.length > 2 ? `all ${post.comments.length}` : ''} comments
                    </div>

                    <div className="post-add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="comment-input"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button
                            className={`post-comment-button ${commentInputs[post.id]?.trim() ? 'active' : ''}`}
                            onClick={() => handleAddComment(post.id)}
                        >
                            Post
                        </button>
                    </div>
                </div>
            ))}
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
        </div>
    );
}

export default Posts;