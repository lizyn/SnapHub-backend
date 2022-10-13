import './App.css';
import React, { useState } from 'react';
import FollowRecommendation from './components/FollowRecommendation';
import CreatePostModal from './components/CreatePostModal';

function App() {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const closePostModal = () => setPostModalOpen(false);
  return (
    <div>
      <FollowRecommendation/>
      <div>
        <button type="button" className="button" onClick={() => setPostModalOpen(o => !o)}>
          New Post
        </button>
        <CreatePostModal closeModal={closePostModal} open={postModalOpen}/>
      </div>
    </div>
  );
}


export default App;
