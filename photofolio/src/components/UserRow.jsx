import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { rootUrl } from './Config';
import axios from '../api/axios';

function UserRow(props) {
  UserRow.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    ring: PropTypes.bool,
    showFollow: PropTypes.bool,
    userId: PropTypes.number.isRequired
  };

  UserRow.defaultProps = {
    avatar:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1185.jpg',
    ring: false,
    showFollow: false
  };
  const { avatar, name, ring, showFollow, userId } = props;
  const [followBtn, setFollowBtn] = useState('outlined');
  const [followed, setFollowed] = useState(false);
  const [followId, setFollowId] = useState();
  const currentUserId = 1;
  const toggleFollow = async (userIdToFollow, isFollow) => {
    const params = {
      userId: userIdToFollow,
      followerId: currentUserId
    };
    try {
      if (isFollow) {
        const response = await axios.post(`${rootUrl}/follows`, params);
        setFollowId(response.data.id);
        console.log(response);
      } else if (followId) {
        const response = await axios.delete(`${rootUrl}/follows/${followId}`);
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleFollowBtnClick = () => {
    if (followed) {
      toggleFollow(userId, false);
      setFollowBtn('outlined');
    } else {
      toggleFollow(userId, true);
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
            src={avatar}
            alt={name}
          />
        )}
        {!ring && <img className="profile-pic" src={avatar} alt={name} />}
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
