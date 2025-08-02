import React from 'react'
import Homepage from './components/Mainpage/Mainpage'
import Notifications from './components/Notifications/Notifications'
import Profile from './components//Profile/Profile'
import Viewpost from './components/Profile/Viewpost'
import MyProfile from './components//Myprofile/Myprofile'
import Reels from './components/Reels/Reels'
import Search from './components/Search/Search'
import Messages from './components/Messages/Messages'
import Chat from './components/Messages/Chat'
import NotFound from './components/NotFound/NotFound'
import { Routes, Route, Navigate } from 'react-router-dom'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/user/:username/post/:postId" element={<Viewpost />} />
        <Route path='/reels' element={<Reels />} />
        <Route path='/search' element={<Search />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/chat/:username' element={<Chat />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  )
}

export default App