import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMagnifyingGlass, faXmark, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { loadProfiles } from '../data/dataLoader';
import './Search.css';
import Verified from '../Profileverified/Verified';
import Bottomnav from '../Bottomnav/Bottomnav';

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            try {
                const profiles = await loadProfiles();
                setAllProfiles(profiles);
            } catch (err) {
                console.error('Failed to load profiles', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = allProfiles.filter(profile => {
            const fullNameMatch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            const usernameMatch = profile.username.toLowerCase().includes(searchTerm.toLowerCase());
            return fullNameMatch || usernameMatch;
        });

        setSearchResults(results);
    }, [searchTerm, allProfiles]);

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const handleUserClick = (user) => {
        setRecentSearches(prev => {
            const existingIndex = prev.findIndex(item => item.id === user.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated.splice(existingIndex, 1);
                return [user, ...updated];
            }
            return [user, ...prev].slice(0, 5);
        });
        navigate(`/user/${user.username}`);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    const removeRecentSearch = (id, e) => {
        e.stopPropagation();
        setRecentSearches(prev => prev.filter(user => user.id !== id));
    };

    return (
        <>
            <div className="search-page">
                <div className="search-header">
                    <button onClick={() => navigate('/')} className="nav-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="search-input-container">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="clear-button">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="search-content">
                    {isLoading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : searchTerm ? (
                        <div className="results-container">
                            {searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="user-result"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <div className="user-avatar-large">
                                            <img src={user.avatar} alt={user.username} />
                                        </div>
                                        <div className="user-info">
                                            <div className="username-row-2">
                                                <span className="username-2">{user.username}{user.isVerified && (
                                                    <Verified />
                                                )}<br></br>{user.fullName} </span>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No results found</div>
                            )}
                        </div>
                    ) : (
                        <div className="recent-searches">
                            <div className="recent-header">
                                <h3>Recent</h3>
                                {recentSearches.length > 0 && (
                                    <button
                                        onClick={clearRecentSearches}
                                        className="clear-all-button"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {recentSearches.length > 0 ? (
                                recentSearches.map((user) => (
                                    <div
                                        key={user.id}
                                        className="recent-user"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <div className="recent-user-content">
                                            <FontAwesomeIcon icon={faClock} className="recent-icon" />
                                            <div className="user-avatar-small">
                                                <img src={user.avatar} alt={user.username} />
                                            </div>
                                            <div className="user-info-2">
                                                <span className="username-2">{user.fullName}{user.isVerified && (
                                                    <Verified />
                                                )}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => removeRecentSearch(user.id, e)}
                                            className="remove-button"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-recent">No recent searches</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Bottomnav />
        </>
    );
}
export default SearchPage