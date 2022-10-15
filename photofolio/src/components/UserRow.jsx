import React from 'react';
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
  // const profilePicUrl = defaultAvatar;
  // const username = props.name;
  const follow = () => {};

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
          // <button className='transparent-button right' onClick={follow}>
          // Follow
          // </button>
          <Button
            variant="outlined"
            size="small"
            sx={{ marginLeft: 'auto' }}
            onClick={follow}
          >
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserRow;
