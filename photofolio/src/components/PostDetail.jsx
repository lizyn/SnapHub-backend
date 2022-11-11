import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LikeIconOutlined from '@mui/icons-material/ThumbUpOutlined';
import LikeIconFilled from '@mui/icons-material/ThumbUp';
import { MentionsInput, Mention } from 'react-mentions';
import { rootUrl } from './Config';
import commentIcon from '../icons/Comment.svg';
import sendIcon from '../icons/Send.svg';
import { fetchComments, likePosts, createComment } from '../api/axios';
import CommentRow from './CommentRow';
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
    title: PropTypes.string.isRequired,
    img: PropTypes.string,
    avatar: PropTypes.string,
    likes: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired
  };

  PostDetail.defaultProps = {
    img: '/',
    avatar: '/'
  };

  const {
    open,
    setOpen,
    img,
    author,
    avatar,
    likes,
    title,
    // commentNum,
    postId
  } = props;

  const [comments, setComments] = useState([]);
  // const commentsUpdated = useRef(false);
  const [postLiked, setPostLiked] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentSubmit, setCommentSubmit] = useState('');
  const [mentionCandidates, setMentionCandidates] = useState([]);

  const getMentionCandidates = async (num) => {
    try {
      const response = await axios.get(`${rootUrl}/users?limit=${num}`);
      const candidates = response.data.map((user) => ({
        id: user.id,
        display: `${user.firstName} ${user.lastName}`
      }));
      setMentionCandidates(candidates);
    } catch (err) {
      // return err;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const commentsData = await fetchComments(postId);
      setComments(commentsData);
    }
    fetchData();
  }, [commentSubmit]);

  useEffect(() => {
    getMentionCandidates(12);
  }, []);

  const handleClose = (e, r) => {
    if (r === 'backdropClick') {
      setOpen(false);
    }
  };

  const handleLikeClick = () => {
    setPostLiked((currentLike) => !currentLike);
    if (!postLiked) {
      likePosts(postId, likes + 1);
    } else {
      likePosts(postId, likes);
    }
  };

  const populateComments = () => {
    const allComments = [];
    comments.forEach((comment) => {
      allComments.push(
        <CommentRow
          key={comment.id}
          userId={comment.userId}
          commentText={comment.text}
        />
      );
    });
    return allComments;
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const convertMentionInComment = (comment) => {
    let clickableComment = comment;
    clickableComment = clickableComment
      .split('@@@^')
      .join('<a href="/profile/');
    clickableComment = clickableComment.split('@@@|').join('">@');
    clickableComment = clickableComment.split('$@@@').join('</a>');
    clickableComment = `@${clickableComment}`;
    console.log(clickableComment);
    return clickableComment;
  };

  const handleCommentSubmit = () => {
    const comment = convertMentionInComment(commentInput);
    // const comment = commentInput;
    createComment(1, postId, comment);
    setCommentSubmit(comment);
    setCommentInput('');
    console.log('clicked');
  };

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
              <p className="post-detail-description-user">{title}</p>
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
                  <IconButton
                    onClick={handleLikeClick}
                    aria-label="like"
                    sx={{ curser: 'pointer' }}
                  >
                    {postLiked ? (
                      <LikeIconFilled
                        sx={{
                          color: 'orange!important'
                        }}
                      />
                    ) : (
                      <LikeIconOutlined />
                    )}
                  </IconButton>
                  <p>{postLiked ? `${likes + 1} Likes` : `${likes} Likes`}</p>
                </div>
                <div className="post-detail-stats">
                  <img src={commentIcon} alt="comment" />
                  <p>{comments.length} Comments</p>
                </div>
              </div>
              <div className="post-detail-post-comment">
                <button type="submit" onClick={handleCommentSubmit}>
                  <img src={sendIcon} alt="send comment" />
                </button>
                {/* <input
                  type="text"
                  placeholder="Post a comment"
                  name="postComment"
                  onChange={handleCommentChange}
                /> */}
                <MentionsInput
                  className="comments-textarea"
                  value={commentInput}
                  placeholder="Post a comment. Mention with '@'"
                  onChange={handleCommentChange}
                  singleLine
                  style={{
                    width: '75%',
                    maxWidth: '20em'
                  }}
                >
                  <Mention
                    trigger="@"
                    data={mentionCandidates}
                    markup="@@@^__id__@@@|__display__$@@@"
                    style={{ backgroundColor: '#FFDD2B' }}
                    // displayTransform={(id, display) => display}
                    // renderSuggestion={this.renderUserSuggestion}
                  />
                </MentionsInput>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default PostDetail;
