import React, { Component } from 'react';
import UserRow from './UserRow';

function UsersToFollow(props) {
  // const {users} = props.users;
  const users = [{"profilePicUrl": 1, "name": 1}, {"profilePicUrl": 2, "name": 2}, {"profilePicUrl": 3, "name": 3}];
  let userRows = [];
  users.forEach((user, index) => {
    userRows.push(<UserRow key={index}/>)
  })
  return (   
      <ul>
        {userRows}
      </ul>
  )
}

export default UsersToFollow;
