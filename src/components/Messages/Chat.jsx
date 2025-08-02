import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faCamera, faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import Verified from '../Profileverified/Verified';
import { loadProfiles } from '../data/dataLoader';
import { useState, useEffect } from 'react';
import './Chats.css'

function Chat() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await loadProfiles();
                const foundProfile = data.find(p => p.username === username);
                setProfile(foundProfile);

                const sampleMessages = {
                    'traveler': [
                        {
                            id: 1,
                            text: "Hey! How's your day going?",
                            isMe: false,
                            timestamp: '10:30 AM',
                            username: 'traveler',
                            avatar: `https://randomuser.me/api/portraits/men/32.jpg`
                        },
                        {
                            id: 2,
                            text: "It's going great! Just finished a hike.",
                            isMe: true,
                            timestamp: '10:32 AM'
                        }
                    ],
                    'fitness_coach': [
                        {
                            id: 1,
                            text: "Check out this cool photo I took!",
                            isMe: false,
                            timestamp: 'Yesterday',
                            username: 'fitness_coach',
                            avatar: `https://randomuser.me/api/portraits/men/22.jpg`,
                            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        },
                        {
                            id: 2,
                            text: "Wow, that's an amazing view!",
                            isMe: true,
                            timestamp: 'Yesterday'
                        }
                    ],
                    'photography_pro': [
                        {
                            id: 1,
                            text: "Are we still on for the meeting tomorrow?",
                            isMe: false,
                            timestamp: '2d',
                            username: 'photography_pro',
                            avatar: `https://randomuser.me/api/portraits/men/45.jpg`
                        },
                        {
                            id: 2,
                            text: "Yes, 2pm at the coffee shop works for me",
                            isMe: true,
                            timestamp: '2d'
                        }
                    ],
                    'food_blogger': [
                        {
                            id: 1,
                            text: "Happy birthday! 🎉",
                            isMe: false,
                            timestamp: '1w',
                            username: 'food_blogger',
                            avatar: `https://randomuser.me/api/portraits/women/33.jpg`
                        },
                        {
                            id: 2,
                            text: "Thank you so much! 😊",
                            isMe: true,
                            timestamp: '1w'
                        }
                    ],
                    'car_enthusiast': [
                        {
                            id: 1,
                            text: "Just posted a new reel, let me know what you think!",
                            isMe: false,
                            timestamp: '3w',
                            username: 'car_enthusiast',
                            avatar: `https://randomuser.me/api/portraits/men/60.jpg`
                        },
                        {
                            id: 2,
                            text: "That's an awesome car! Love the editing too",
                            isMe: true,
                            timestamp: '3w'
                        }
                    ]
                };

                setMessages(sampleMessages[username] || []);
            } catch (error) {
                console.error('Error loading chat:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !profile) return;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            isMe: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            username: 'andrew.lee'
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    if (loading) return <div>Loading chat...</div>;
    if (!profile) return <div>Chat not found</div>;

    return (
        <div className='chat-app-container'>
            <div className="chat-view">
                <div className="chat-header">
                    <div className="chat-header-left">
                        <button onClick={() => navigate('/messages')} className="back-button">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="chat-user-info" onClick={() => navigate(`/user/${profile.username}`)}>
                            <img src={profile.avatar} alt={profile.username} />
                            <span className="username" style={{ marginLeft: '5px' }}>{profile.username}</span>
                            {profile.isVerified && <Verified />}
                        </div>
                    </div>
                    <div className="chat-header-right">
                        <button className="video-call-button">
                            <FontAwesomeIcon icon={faPhone} />
                        </button>
                        <button className="options-button">
                            <FontAwesomeIcon icon={faVideo} />
                        </button>
                    </div>
                </div>

                <div className="messages-container">
                    <div className="messages-scroll">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`message ${msg.isMe ? 'my-message' : 'their-message'}`}
                            >
                                {!msg.isMe && (
                                    <img
                                        src={msg.avatar || profile.avatar}
                                        alt={msg.username}
                                        className="message-avatar"
                                        onClick={() => navigate(`/user/${msg.username}`)}
                                    />
                                )}
                                <div className="message-content">
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Shared content"
                                            className="message-image"
                                        />
                                    )}
                                    <p>{msg.text}</p>
                                    <div className="message-footer">
                                        <span className="timestamp">{msg.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="message-input-container">
                    <button className="emoji-button">
                        <FontAwesomeIcon icon={faFaceSmile} />
                    </button>
                    <input
                        type="text"
                        placeholder="Message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        {newMessage.trim() ? (
                            <FontAwesomeIcon icon={faPaperPlane} />
                        ) : (
                            <FontAwesomeIcon icon={faCamera} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;