import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
import userOther1 from '../images/userOther1.jpg';
import likeIcon from '../icons/Like.svg';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
import './PostDetail.css';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  maxHeight: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  zIndex: 4000
};

function PostDetail(props) {
  PostDetail.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
  };

  const { open, setOpen } = props;

  const handleClose = (e, r) => {
    if (r === 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div className="post-modal-main">
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="post-title"
        aria-describedby="post-description"
      >
        <Box className="post-detail-text" sx={style}>
          <div className="post-detail-left">
            <img
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee"
              alt="post"
            />
            <div className="post-detail-description">
              <Avatar
                alt="me"
                className="Avatar"
                src={userOther1}
                sx={{
                  width: 70,
                  height: 70,
                  position: 'absolute',
                  top: '77%',
                  left: '2%'
                }}
              />
              <p className="post-detail-description-user">title</p>
              <div className="post-detail-description-text">
                <p>text description</p>
              </div>
            </div>
          </div>
          <div className="post-detail-right">
            <div className="post-detail-userhead">
              <Avatar
                alt="me"
                className="Avatar"
                src={userOther1}
                sx={{ width: 60, height: 60 }}
              />
              <p className="postUsername">User</p>
              <p className="postTime">20 minutes ago</p>
            </div>
            <div className="post-detail-comments">
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
              <h1>comment</h1>
            </div>
            <div className="post-detail-actions">
              <div className="post-detail-postStats">
                <div className="post-detail-stats">
                  <img src={likeIcon} alt="like" />
                  <p>26 Likes</p>
                </div>
                <div className="post-detail-stats">
                  <img src={commentIcon} alt="comment" />
                  <p>4 Comments</p>
                </div>
              </div>
              <div className="post-detail-post-comment">
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
        </Box>
      </Modal>
    </div>
  );
}

export default PostDetail;
