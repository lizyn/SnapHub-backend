import './App.css';
import React, { useState } from 'react';
import { Alert } from '@mui/material';
import Navbar from './components/Navbar';
// import CreatePostModal from './components/CreatePostModal';
// import logo from './logo.svg';
// import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
// import ProfilePage from './components/ProfilePage'
// import HomePage from './components/HomePage';

function App() {
  const [postModalIsOpen, setPostModalOpen] = useState(false);
  const closePostModal = () => setPostModalOpen(false);
  const [alert, setAlert] = useState(false);
  // console.log(alert);
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
    <div>
      {alert && (
        <Alert
          severity="success"
          sx={{
            position: 'absolute',
            top: '10%',
            left: '40%',
            zIndex: 1000,
            margin: 'auto'
          }}
        >
          Your post has been successfully created!
        </Alert>
      )}
      <Navbar
        postModalIsOpen={postModalIsOpen}
        setPostModalOpen={setPostModalOpen}
        closePostModal={closePostModal}
        setAlert={setAlert}
      />
    </div>
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
