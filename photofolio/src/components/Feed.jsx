import React, { useState } from 'react';
import './Feed.css';
import { Avatar } from '@mui/material';
import PostDetail from './PostDetail';
import userOther1 from '../images/userOther1.jpg';
import likeIcon from '../icons/Like.svg';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
import post1 from '../images/post1.jpg';

function Feed() {
  const [detailOpen, setDetailOpen] = useState(false);

  const handleClick = () => {
    setDetailOpen(true);
  };

  return (
    <div>
      <PostDetail open={detailOpen} setOpen={setDetailOpen} />
      <div className="post">
        <div className="postHead">
          <Avatar
            alt="me"
            className="Avatar"
            src={userOther1}
            sx={{ width: 50, height: 50 }}
          />
          <p className="postUsername">Erin Rhiel Madsen</p>
          <p className="postTime">20 minutes ago</p>
        </div>
        <button type="button" onClick={handleClick}>
          <img src={post1} alt="post" />
        </button>
        <div className="postActions">
          <div className="postStats">
            <div className="stats">
              <img src={likeIcon} alt="like" />
              <p>26 Likes</p>
            </div>
            <div className="stats">
              <img src={commentIcon} alt="comment" />
              <p>4 Comments</p>
            </div>
          </div>
          <div className="postComment">
            <button type="submit">
              <img src={sendIcon} alt="send comment" />
            </button>
            <input
              type="text"
              placeholder="Post a comment"
              name="postComment"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
