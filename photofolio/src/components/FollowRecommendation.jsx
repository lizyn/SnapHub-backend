import React from 'react';
import UserList from './UserList';
import avatar1 from '../images/avatar1.png';
import avatar2 from '../images/avatar2.png';
import avatar3 from '../images/avatar3.png';
import defaultAvatar from '../images/defaultAvatar.png';

function FollowRecommendation() {
  const users = [
    { profilePicUrl: avatar1, name: 'Alfonso Schleifer', id: 1 },
    { profilePicUrl: avatar2, name: 'Erin Rhiel Madsen', id: 2 },
    { profilePicUrl: avatar3, name: 'Zaire George', id: 3 }
  ];
  const numDummy = 6 - users.length;
  for (let index = 0; index < numDummy; index += 1) {
    users.push({
      profilePicUrl: defaultAvatar,
      name: 'Default Name',
      id: Math.random()
    });
  }
  return (
    <div className="user-recommend-card">
      <UserList users={users} showFollow />
    </div>
  );
}

export default FollowRecommendation;
