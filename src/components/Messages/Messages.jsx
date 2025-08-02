import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { loadProfiles } from '../data/dataLoader';
import './Messages.css';
import Verified from '../Profileverified/Verified';

function Message() {
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const data = await loadProfiles();
                const targetProfiles = data.filter(profile =>
                    [1, 5, 11, 16, 22].includes(profile.id)
                );

                const sampleMessages = {
                    1: [
                        {
                            id: 1,
                            text: "Hey! How's your day going?",
                            isMe: false,
                            timestamp: '10:30 AM',
                            username: 'traveler',
                            avatar: `${import.meta.env.USER_API}/men/32.jpg`
                        },
                        {
                            id: 2,
                            text: "It's going great! Just finished a hike.",
                            isMe: true,
                            timestamp: '10:32 AM'
                        }
                    ],
                    5: [
                        {
                            id: 1,
                            text: "Check out this cool photo I took!",
                            isMe: false,
                            timestamp: 'Yesterday',
                            username: 'fitness_coach',
                            avatar: `${import.meta.env.USER_API}/men/22.jpg`,
                            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
                        },
                        {
                            id: 2,
                            text: "Wow, that's an amazing view!",
                            isMe: true,
                            timestamp: 'Yesterday'
                        }
                    ],
                    11: [
                        {
                            id: 1,
                            text: "Are we still on for the meeting tomorrow?",
                            isMe: false,
                            timestamp: '2d',
                            username: 'photography_pro',
                            avatar: `${import.meta.env.USER_API}/men/45.jpg`
                        },
                        {
                            id: 2,
                            text: "Yes, 2pm at the coffee shop works for me",
                            isMe: true,
                            timestamp: '2d'
                        }
                    ],
                    16: [
                        {
                            id: 1,
                            text: "Happy birthday! 🎉",
                            isMe: false,
                            timestamp: '1w',
                            username: 'food_blogger',
                            avatar: `${import.meta.env.USER_API}/women/33.jpg`
                        },
                        {
                            id: 2,
                            text: "Thank you so much! 😊",
                            isMe: true,
                            timestamp: '1w'
                        }
                    ],
                    22: [
                        {
                            id: 1,
                            text: "Just posted a new reel, let me know what you think!",
                            isMe: false,
                            timestamp: '3w',
                            username: 'car_enthusiast',
                            avatar: `${import.meta.env.USER_API}/men/60.jpg`
                        },
                        {
                            id: 2,
                            text: "That's an awesome car! Love the editing too",
                            isMe: true,
                            timestamp: '3w'
                        }
                    ]
                };

                setFilteredProfiles(targetProfiles);
                setMessages(sampleMessages);
            } catch (error) {
                console.error('Error loading profiles:', error);
                setError('Failed to load messages');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            isMe: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMsg]
        }));

        setNewMessage('');
    };

    const handleChatClick = (profileId, username) => {
        setActiveChat(profileId);
        navigate(`/chat/${username}`);
    };

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="instagram-dm-container">
            <div className="dm-sidebar">
                <div className="dm-header">
                    <div className="dm-header-left">
                        <button onClick={() => navigate('/')} className="back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <h2>andrew.lee</h2>
                    </div>
                </div>

                <div className="dm-search">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="dm-list">
                    {filteredProfiles.map(profile => {
                        const profileMessages = messages[profile.id] || [];
                        const lastMessage = profileMessages[profileMessages.length - 1];

                        return (
                            <div
                                key={profile.id}
                                className={`dm-user ${activeChat === profile.id ? 'active' : ''}`}
                                onClick={() => handleChatClick(profile.id, profile.username)}
                            >
                                <div className="dm-user-avatar">
                                    <img src={profile.avatar} alt={profile.username} />
                                </div>
                                <div className="dm-user-info">
                                    <div className="username-row">
                                        <span className="username">{profile.username}</span>
                                        {profile.isVerified && <Verified />}
                                        {lastMessage && (
                                            <span className="message-time">{lastMessage.timestamp}</span>
                                        )}
                                    </div>
                                    <div className="last-message-row">
                                        {lastMessage && (
                                            <span className="last-message">
                                                {lastMessage.isMe ? 'You: ' : ''}
                                                {lastMessage.text.substring(0, 20)}
                                                {lastMessage.text.length > 20 && '...'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {activeChat && (
                <div className="dm-chat-container">
                    <div className="dm-chat-messages">
                        {messages[activeChat]?.map((message, index) => (
                            <div key={index} className={`message ${message.isMe ? 'sent' : 'received'}`}>
                                {!message.isMe && (
                                    <img src={message.avatar} alt={message.username} className="message-avatar" />
                                )}
                                <div className="message-content">
                                    {!message.isMe && <span className="message-username">{message.username}</span>}
                                    <p>{message.text}</p>
                                    {message.image && <img src={message.image} alt="Shared content" className="message-image" />}
                                    <span className="message-time">{message.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="dm-chat-input">
                        <input
                            type="text"
                            placeholder="Message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message;