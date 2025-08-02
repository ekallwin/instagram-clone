import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import './Header.css'

function Header() {
    const navigate = useNavigate()
    return (
        <>
            <header className="app-header" >
                <img
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="Instagram Logo"
                    className="instagram-logo"
                />
                <div className="header-icons">
                    <FontAwesomeIcon
                        icon={regularHeart}
                        size="xl"
                        onClick={() => navigate('/notifications')}
                    />
                    <FontAwesomeIcon icon={faFacebookMessenger} size='xl'  onClick={() => navigate('/messages')}/>
                </div>
            </header>
        </>
    )
}

export default Header