import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar } from '@mui/material';
import { fetchUsers, editComment } from '../api/axios';
import './CommentRow.css';

function CommentRow(props) {
  CommentRow.propTypes = {
    userId: PropTypes.number.isRequired,
    commentText: PropTypes.string.isRequired,
    commentId: PropTypes.number.isRequired,
    commentDel: PropTypes.func.isRequired,
    commentEd: PropTypes.func.isRequired
  };

  const { userId, commentText, commentId, commentDel, commentEd } = props;

  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);
  const [commenter, setCommenter] = useState([]);
  const [editing, setEditing] = useState(false);
  const [commentEdit, setCommentEdit] = useState(commentText);

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
    setEditing(true);
    handleEditClose();
  };

  const handleCommentEdit = (e) => {
    setCommentEdit(e.target.value);
  };

  const handleEditSave = async () => {
    // send edit comment axios request, set await so that refreshing happens after the change
    await editComment(commentId, commentEdit);
    commentEd((currentEdited) => !currentEdited);
    // turn off editing mode
    setEditing(false);
  };

  const handleDeleteClick = () => {
    commentDel(commentId);
    handleEditClose();
  };

  return (

    <div>
      {editing && ( // if editing is true, change comment text area to editing mode
        <div className="comment-row-main">
          <div className="comment-row-left">
            <Avatar src={commenter.avatar} />
            <input
              type="text"
              placeholder={commentText}
              name="editComment"
              value={commentEdit}
              onChange={handleCommentEdit}
            />
          </div>
          <div>
            <IconButton onClick={handleEditSave}>
              <p>Save</p>
            </IconButton>
          </div>
        </div>
      )}
      {!editing && ( // else just display the comment as usual
        <div className="comment-row-main">
          <div className="comment-row-left">
           <Avatar src={commenter.avatar} />
            <p style={{ fontFamily: 'sans-serif' }}>{parse(commentText)}</p>
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
      )}
    </div>
  );
}

export default CommentRow;
