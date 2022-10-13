import React, { Component } from 'react';
import UserList from './UserList';
import avatar1 from '../images/avatar1.png'
import avatar2 from '../images/avatar2.png'
import avatar3 from '../images/avatar3.png'
import defaultAvatar from '../images/defaultAvatar.png'

function FollowRecommendation(props) {
  const users = [{profilePicUrl: avatar1, name: "Alfonso Schleifer"}, {profilePicUrl: avatar2, name: "Erin Rhiel Madsen"}, {profilePicUrl: avatar3, name: "Zaire George"}];
  const numDummy = 6 - users.length;
  for (let index = 0; index < numDummy; index++) {
    users.push({profilePicUrl: defaultAvatar, name: "Default Name"});
  }
  return (
      <div className='user-recommend'>
        Recommended for you
        <div className='user-recommend-card'>
          <UserList users={users} ring={false} showFollow={true}/>
        </div>
      </div>   
  )
}

export default FollowRecommendation;
