import React from 'react';
import './Home.css';
import Header from '../Header/Header';
import Stories from '../Stories/Stories';
import Posts from '../Posts/Posts';
import Bottomnav from '../Bottomnav/Bottomnav';
const InstagramHome = () => {

    return (
        <div className="instagram-app">
            <Header />
            <Stories />
            <Posts />
            <Bottomnav />

        </div>
    );
};

export default InstagramHome;