import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar } from '@mui/material';
import { fetchUsers } from '../api/axios';
import './CommentRow.css';

function CommentRow(props) {
  CommentRow.propTypes = {
    userId: PropTypes.number.isRequired,
    commentText: PropTypes.string.isRequired,
    commentId: PropTypes.number.isRequired,
    commentDel: PropTypes.func.isRequired
  };

  const { userId, commentText, commentId, commentDel } = props;

  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);
  const [commenter, setCommenter] = useState([]);

  useEffect(() => {
    setCommenter([]);
    async function fetchCommenterData() {
      const commenters = await fetchUsers(userId);
      setCommenter(commenters);
    }
    fetchCommenterData();
  }, []);

  const handleCommentMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleEditClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleEditClose();
  };
  const handleDeleteClick = () => {
    commentDel(commentId);
    handleEditClose();
  };

  return (
    <div className="comment-row-main">
      <div className="comment-row-left">
        <Avatar src={commenter.avatar} />
        <p>{commentText}</p>
      </div>
      <div>
        <IconButton
          className="comment-row-button"
          id="edit-button"
          aria-controls={open ? 'edit-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleCommentMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="edit-drop-down"
          anchorEl={anchorEl}
          open={open}
          onClose={handleEditClose}
          MenuListProps={{
            'aria-labelledby': 'edit-button'
          }}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default CommentRow;
