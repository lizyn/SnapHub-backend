import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
// import userOther1 from '../images/userOther1.jpg';
import likeIcon from '../icons/Like.svg';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
import { fetchComments } from '../api/axios';
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
    setOpen: PropTypes.func.isRequired,
    author: PropTypes.string.isRequired,
    img: PropTypes.string,
    avatar: PropTypes.string,
    likes: PropTypes.number.isRequired,
    commentIds: PropTypes.number
  };

  PostDetail.defaultProps = {
    img: '/',
    avatar: '/',
    commentIds: 'no comments'
  };

  const { open, setOpen, img, author, avatar, likes, commentIds } = props;

  const [comments, setComments] = useState([]);
  const firstRendering = useRef(true);

  useEffect(() => {
    async function fetchData() {
      const commentsData = await fetchComments();
      setComments(commentsData);
    }

    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  const commentList = comments.filter((x) => commentIds.includes(x.id));

  const handleClose = (e, r) => {
    if (r === 'backdropClick') {
      setOpen(false);
    }
  };

  const populateComments = () => {
    const allComments = [];
    commentList.forEach((comment) => {
      allComments.push(<p key={comment.id}>{comment.text}</p>);
    });
    return allComments;
  };

  // console.log(author);

  const allComments = populateComments();
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
            <img src={img} className="post-detail-image" alt="post" />
            <div className="post-detail-description">
              <Avatar
                alt="me"
                className="Avatar"
                src={avatar}
                sx={{
                  width: 70,
                  height: 70,
                  position: 'absolute',
                  top: '77%',
                  left: '2%'
                }}
              />
              <p className="post-detail-description-user">Title</p>
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
                src={avatar}
                sx={{ width: 60, height: 60 }}
              />
              <p className="postUsername">{author}</p>
              <p className="postTime">20 minutes ago</p>
            </div>
            <div className="post-detail-comments">{allComments}</div>
            <div className="post-detail-actions">
              <div className="post-detail-postStats">
                <div className="post-detail-stats">
                  <img src={likeIcon} alt="like" />
                  <p>{likes} Likes</p>
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
