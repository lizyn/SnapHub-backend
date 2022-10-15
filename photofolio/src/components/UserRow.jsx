import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

function UserRow(props) {
  UserRow.propTypes = {
    profilePicUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    ring: PropTypes.bool,
    showFollow: PropTypes.bool
  };

  UserRow.defaultProps = {
    ring: false,
    showFollow: false
  };
  const { profilePicUrl, name, ring, showFollow } = props;
  const [followBtn, setFollowBtn] = useState('outlined');
  const [followed, setFollowed] = useState(false);

  const handleFollowBtnClick = () => {
    if (followed) {
      // unfollow
      setFollowBtn('outlined');
    } else {
      // follow;
      setFollowBtn('contained');
    }
    setFollowed((o) => !o);
  };

  return (
    <div className="user-row">
      <div className="container">
        {ring && (
          <img
            className="profile-pic profile-pic-ring"
            src={profilePicUrl}
            alt={name}
          />
        )}
        {!ring && (
          <img className="profile-pic" src={profilePicUrl} alt={name} />
        )}
        <div className="username">{name}</div>
        {showFollow && (
          <Button
            variant={followBtn}
            size="small"
            sx={{ marginLeft: 'auto' }}
            onClick={handleFollowBtnClick}
          >
            {followed && 'followed'} {!followed && 'follow'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserRow;
