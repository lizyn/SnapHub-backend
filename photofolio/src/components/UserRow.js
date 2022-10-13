import React, { Component } from 'react';


function UserRow(props) {
  const {profilePicUrl, name, ring, showFollow} = props;
  // const profilePicUrl = defaultAvatar;
  // const username = props.name;
  return (
    <div className='user-row'>
      <div className='container'>
        {ring &&
          <img className='profile-pic profile-pic-ring' src={profilePicUrl} alt={name}/>
        }
        {!ring && 
          <img className='profile-pic' src={profilePicUrl} alt={name}/>
        }
        <div className='username'>{name}</div>
        {showFollow &&
          <button className='white-button right' onClick={follow}>
          Follow
          </button>
        }
      </div>
    </div>
  );
}

function follow(username) {

}

export default UserRow;