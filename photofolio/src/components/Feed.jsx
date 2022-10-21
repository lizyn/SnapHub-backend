import React, { useState } from 'react';

import PropTypes from 'prop-types';
import './Feed.css';
import { Avatar } from '@mui/material';
import PostDetail from './PostDetail';

import likeIcon from '../icons/Like.svg';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
// import post1 from '../images/post1.jpg';

function Feed(props) {
  Feed.propTypes = {
    author: PropTypes.string.isRequired,
    img: PropTypes.string,
    avatar: PropTypes.string,
    likes: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    commentIds: PropTypes.arrayOf(PropTypes.number)
  };

  Feed.defaultProps = {
    img: '/',
    avatar: '/',
    commentIds: 'no comments'
  };

  const { avatar, author, img, likes, commentIds, title } = props;
  const [detailOpen, setDetailOpen] = useState(false);

  const handleClick = () => {
    setDetailOpen(true);
  };
  
  return (
    <div>
      <div style={{ display: 'none' }}>
        <PostDetail
          open={detailOpen}
          setOpen={setDetailOpen}
          author={author}
          avatar={avatar}
          img={img}
          likes={likes}
          commentIds={commentIds}
          title={title}
          commentNum={commentIds.length}
        />
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
                <p>{likes} Likes</p>
              </div>
              <div className="stats">
                <img src={commentIcon} alt="comment" />
                <p>{commentIds.length} Comments</p>
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
