import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadProfiles } from '../data/dataLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faBookmark as solidBookmark, faArrowLeft, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark, faComment } from '@fortawesome/free-regular-svg-icons';
import Verified from '../Profileverified/Verified';
import CommentModel from '../Commentmodel/Commentmodel';
import './Viewpost.css';

function PostDetail() {
    const { username, postId } = useParams();
    const [post, setPost] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentInput, setCommentInput] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadProfiles();
                const user = data.find(p => p.username === username);
                if (user) {
                    setProfile(user);
                    const foundPost = user.posts.find(p => p.id === parseInt(postId));
                    setPost(foundPost || null);
                }
            } catch (err) {
                console.error('Failed to load post:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [username, postId]);

    const handleLike = () => {
        setPost(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
        }));
    };

    const handleSave = () => {
        setPost(prev => ({
            ...prev,
            isSaved: !prev.isSaved
        }));
    };

    const handleAddComment = () => {
        if (!commentInput.trim()) return;
        const newComment = {
            id: Date.now(),
            username: 'current_user',
            text: commentInput,
            timestamp: 'Just now'
        };
        setPost(prev => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));
        setCommentInput('');
    };

    const toggleCommentModal = () => {
        setShowCommentModal(!showCommentModal);
    };

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-detail-container">
            {showCommentModal && (
                <CommentModel
                    post={{ ...post, profile }}
                    onClose={toggleCommentModal}
                    onLike={handleLike}
                    onSave={handleSave}
                    commentInput={commentInput}
                    onCommentChange={(id, value) => setCommentInput(value)}
                    onAddComment={handleAddComment}
                />
            )}

            <div className="post-detail-header">
                <button onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>Post</h2>
            </div>

            <div className="post-detail-content">
                <div className="post-detail-sidebar">
                    <div className="post-detail-user">
                        <img src={profile.avatar} alt={username} />
                        <div style={{ flex: 1 }}>
                            <span>{username} {profile.isVerified && <Verified />}</span>
                        </div>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </div>

                    <div className="post-detail-image">
                        <img src={post.image} alt={`Post by ${username}`} />
                    </div>

                    <div className="post-detail-actions">
                        <div className="post-actions-left">
                            <FontAwesomeIcon
                                icon={post.isLiked ? solidHeart : regularHeart}
                                onClick={handleLike}
                                style={{ color: post.isLiked ? '#FF3040' : '#000000' }}
                            />
                            <FontAwesomeIcon 
                                icon={faComment} 
                                onClick={toggleCommentModal}
                            />
                        </div>
                        <FontAwesomeIcon
                            icon={post.isSaved ? solidBookmark : faBookmark}
                            onClick={handleSave}
                        />
                    </div>

                    <div className="post-detail-likes">{post.likes.toLocaleString()} likes</div>

                    <div className="post-detail-caption">
                        <strong>{username}</strong> {post.caption}
                        <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '4px' }}>
                            {post.timestamp || '2 DAYS AGO'}
                        </div>
                    </div>

                    <div className="post-detail-add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!commentInput.trim()}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;