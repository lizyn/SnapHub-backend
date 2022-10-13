
import './App.css';
import React, { useState } from 'react';
import FollowRecommendation from './components/FollowRecommendation';
import CreatePostModal from './components/CreatePostModal';

import logo from './logo.svg';
// import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import ProfilePage from './components/ProfilePage'

import HomePage from './components/HomePage';


function App() {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const closePostModal = () => setPostModalOpen(false);
  return (

    //<div>
    //  <FollowRecommendation/>
    //  <div>
    //    <button type="button" className="button" onClick={() => setPostModalOpen(o => !o)}>
    //      New Post
    //    </button>
    //    <CreatePostModal closeModal={closePostModal} open={postModalOpen}/>
    //  </div>
    //</div>

    <ProfilePage />
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

  );
}


export default App;
