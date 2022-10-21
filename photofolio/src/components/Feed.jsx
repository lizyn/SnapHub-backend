import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Feed.css';
import { Avatar } from '@mui/material';
import PostDetail from './PostDetail';
// import userOther1 from '../images/userOther1.jpg';
import likeIcon from '../icons/Like.svg';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
// import post1 from '../images/post1.jpg';

function Feed(props) {
  Feed.propTypes = {
    author: PropTypes.string.isRequired,
    img: PropTypes.string,
    avatar: PropTypes.string
  };

  Feed.defaultProps = {
    img: '/',
    avatar: '/'
  };

  const { avatar, author, img } = props;

  const [detailOpen, setDetailOpen] = useState(false);

  const handleClick = () => {
    setDetailOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'none' }}>
        <PostDetail open={detailOpen} setOpen={setDetailOpen} />
      </div>
      <div>
        <div className="post">
          <div className="postHead">
            <Avatar
              alt="me"
              className="Avatar"
              src={avatar}
              sx={{ width: 50, height: 50, marginTop: 1, marginBottom: 1 }}
            />
            <div className="post-head-detail">
              <p className="postUsername">{author}</p>
              <p className="postTime">20 minutes ago</p>
            </div>
          </div>
          <button type="button" onClick={handleClick}>
            <img src={img} alt="post" />
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
    </div>
  );
}

export default Feed;
