import React from 'react';
// import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
  justifyContent: 'space-between',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24
};

function PostDetail() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //   PostDetail.propTypes = {
  //     Id: PropTypes.number.isRequired,
  //     title: PropTypes.string.isRequired,
  //     img: PropTypes.string.isRequired,
  //     userId: PropTypes.number.isRequired
  //   };

  return (
    <div className="post-modal-main">
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="post-title"
        aria-describedby="post-description"
      >
        <Box className="post-detail-text" sx={style}>
          <div className="post-detail">
            <div className="post-detail-head">
              <Avatar
                alt="me"
                className="Avatar"
                src={userOther1}
                sx={{ width: 50, height: 50 }}
              />
              <p className="postUsername">title</p>
              <p className="postTime">20 minutes ago</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1566371486490-560ded23b5e4"
              alt="post"
            />
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
          <div className="post-detail-comments">
            <p>hi</p>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default PostDetail;
