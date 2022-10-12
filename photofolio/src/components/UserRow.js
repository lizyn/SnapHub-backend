import React, { Component } from 'react';
import defaultAvatar from '../images/defaultAvatar.png'

function UserRow(props) {
  // const {profilePicUrl, username} = props;
  const profilePicUrl = defaultAvatar;
  const username = "Default Name";
  return (
    <div>
      <img src={profilePicUrl} alt={username}/>
      <div>{username}</div>
      <button className='profile-pic' onClick={follow}>
        Follow
      </button>
    </div>
  );
}

function follow(username) {

}

export default UserRow;