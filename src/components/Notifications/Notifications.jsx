import React, { useState } from 'react';
import { FiUserPlus, FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';
import { FaArrowLeft } from "react-icons/fa";
import './Notifications.css';
import { useNavigate } from 'react-router-dom';
import Bottomnav from '../Bottomnav/Bottomnav';

const InstagramNotifications = () => {
    const navigate = useNavigate();
    const initialNotifications = [
        {
            id: 1,
            username: 'johndoe',
            action: 'follow',
            time: '2h ago',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            read: false,
            isFollowing: false
        },
        {
            id: 2,
            username: 'janedoe',
            action: 'like',
            time: '5h ago',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            postPreview: 'https://picsum.photos/200/200',
            read: true,
            isFollowing: false
        },
        {
            id: 3,
            username: 'creative_user',
            action: 'comment',
            time: '1d ago',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            postPreview: 'https://picsum.photos/200/200',
            comment: 'Great photo!',
            read: false,
            isFollowing: false
        },
        {
            id: 4,
            username: 'photography_lover',
            action: 'follow',
            time: '1d ago',
            avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
            read: true,
            isFollowing: true
        }
    ];

    const [notifications, setNotifications] = useState(initialNotifications);

    const handleFollowClick = (id) => {
        setNotifications(notifications.map(notification => {
            if (notification.id === id) {
                return {
                    ...notification,
                    isFollowing: !notification.isFollowing
                };
            }
            return notification;
        }));
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'follow':
                return <FiUserPlus className="notification-icon follow" />;
            case 'like':
                return <FiHeart className="notification-icon like" />;
            case 'comment':
                return <FiMessageCircle className="notification-icon comment" />;
            case 'save':
                return <FiBookmark className="notification-icon save" />;
            default:
                return null;
        }
    };

    const getActionText = (action, username) => {
        switch (action) {
            case 'follow':
                return `${username} started following you`;
            case 'like':
                return `${username} liked your post`;
            case 'comment':
                return `${username} commented on your post`;
            case 'save':
                return `${username} saved your post`;
            default:
                return '';
        }
    };

    return (
        <>
            <div className="instagram-notifications">
                <header className="notifications-header">


                    <h2>
                        <FaArrowLeft onClick={() => navigate('/')} />&nbsp;&nbsp;&nbsp;&nbsp;Notifications</h2>
                </header>

                <div className="notifications-tabs">
                    <button >Last 30 days</button>
                </div>

                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.read ? '' : 'unread'}`}
                        >
                            <div className="notification-avatar">
                                <img src={notification.avatar} alt={notification.username} />
                            </div>

                            <div className="notification-content">
                                <div className="notification-text">
                                    {getActionIcon(notification.action)}
                                    <p>
                                        <span className="username">{notification.username}</span> {getActionText(notification.action, notification.username).replace(`${notification.username} `, '')}
                                    </p>
                                </div>
                                <span className="notification-time">{notification.time}</span>
                            </div>

                            {notification.postPreview && (
                                <div className="notification-preview">
                                    <img src={notification.postPreview} alt="Post preview" />
                                </div>
                            )}

                            {notification.action === 'follow' && (
                                <button
                                    className={`follow-btn ${notification.isFollowing ? 'following' : ''}`}
                                    onClick={() => handleFollowClick(notification.id)}
                                >
                                    {notification.isFollowing ? 'Following' : 'Follow Back'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Bottomnav />
        </>
    );
};

export default InstagramNotifications;