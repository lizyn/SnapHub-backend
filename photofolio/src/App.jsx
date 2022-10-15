import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
// import CreatePostModal from './components/CreatePostModal';
// import logo from './logo.svg';
// import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
// import ProfilePage from './components/ProfilePage'
// import HomePage from './components/HomePage';

function App() {
  const [postModalIsOpen, setPostModalOpen] = useState(false);
  const closePostModal = () => setPostModalOpen(false);
  return (
    // <div>
    //  <FollowRecommendation/>
    //  <div>
    //    <button type="button" className="button" onClick={() => setPostModalOpen(o => !o)}>
    //      New Post
    //    </button>
    //    <CreatePostModal closeModal={closePostModal} open={postModalOpen}/>
    //  </div>
    // </div>

    // <ProfilePage />
    <Navbar
      postModalIsOpen={postModalIsOpen}
      setPostModalOpen={setPostModalOpen}
      closePostModal={closePostModal}
    />
    // <HomePage postModalIsOpen={postModalIsOpen} setPostModalOpen={setPostModalOpen} closePostModal={closePostModal} />
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
