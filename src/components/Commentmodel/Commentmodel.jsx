import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart, faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark, faComment, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import './Commentmodel.css'
const CommentModel = ({
    post,
    onClose,
    onLike,
    onSave,
    commentInput,
    onCommentChange,
    onAddComment
}) => {
    if (!post) return null;

    return (
        <div className="comments-modal">
            <div className="comments-modal-content">
                <div className="comments-modal-header">
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="close-modal-icon"
                        onClick={onClose}
                    />
                    <span className="modal-title">Comments</span>
                    <div style={{ width: '24px' }}></div>

                </div>

                <div className="comments-modal-body">
                    <div className="modal-post-image">
                        <img src={post.image} alt="Post" />
                    </div>

                    <div className="modal-comments-section">
                        <div className="modal-post-header">
                            <img src={post.profile.avatar} alt={post.profile.username} className="modal-user-avatar" />
                            <span className="modal-username">{post.profile.username}</span>
                        </div>

                        <div className="modal-caption">
                            <span className="modal-caption-username">{post.username}</span>
                            {post.caption}
                        </div>

                        <div className="modal-comments-list">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="modal-comment">
                                    <div>
                                        <span className="modal-comment-username">{comment.username}</span>
                                        <span className="modal-comment-text">{comment.text}</span>
                                    </div>
                                    <span className="modal-comment-timestamp">{comment.timestamp}</span>
                                </div>
                            ))}
                        </div>

                        <div className="modal-post-actions">
                            <div className="modal-actions-left">
                                <FontAwesomeIcon
                                    icon={post.isLiked ? solidHeart : regularHeart}
                                    onClick={() => onLike(post.id)}
                                    style={{ color: post.isLiked ? '#FF3040' : '#000000' }}
                                />
                                <FontAwesomeIcon
                                    icon={faComment}
                                    onClick={() => document.querySelector('.modal-add-comment input')?.focus()}
                                />
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </div>
                            <FontAwesomeIcon
                                icon={post.isSaved ? solidBookmark : faBookmark}
                                onClick={() => onSave(post.id)}
                            />
                        </div>

                        <div className="modal-likes-count">
                            {post.likes.toLocaleString()} likes
                        </div>

                        <div className="modal-timestamp">
                            {post.timestamp}
                        </div>

                        <div className="modal-add-comment">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentInput || ''}
                                onChange={(e) => onCommentChange(post.id, e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onAddComment(post.id)}
                            />
                            <button
                                className={`modal-comment-button ${commentInput?.trim() ? 'active' : ''}`}
                                onClick={() => onAddComment(post.id)}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModel;