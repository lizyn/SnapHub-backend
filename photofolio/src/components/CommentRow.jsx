import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { Avatar } from '@mui/material';
import { fetchUsers } from '../api/axios';
import './CommentRow.css';

function CommentRow(props) {
  CommentRow.propTypes = {
    userId: PropTypes.number.isRequired,
    commentText: PropTypes.string.isRequired
  };

  const { userId, commentText } = props;

  const [commenter, setCommenter] = useState([]);
  const firstRendering = useRef(true);

  useEffect(() => {
    async function fetchCommenterData() {
      const commenters = await fetchUsers(userId);
      setCommenter(commenters);
    }

    if (firstRendering.current) {
      firstRendering.current = false;
      fetchCommenterData();
    }
  });

  return (
    <div className="comment-row-main">
      <Avatar src={commenter.avatar} />
      <p style={{ fontFamily: 'sans-serif' }}>{parse(commentText)}</p>
    </div>
  );
}

export default CommentRow;
