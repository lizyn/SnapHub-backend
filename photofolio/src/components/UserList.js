import React from 'react';
import UserRow from './UserRow';

function UserList(props) {
  let userRows = [];
  const users = props.users;
  users.forEach((user, index) => {
    userRows.push(<div className='user-row-card' key={index}><UserRow profilePicUrl={user.profilePicUrl} name={user.name} ring={props.ring} showFollow={props.showFollow}/></div>);
  })
  return (   
      <div>
        {userRows}
      </div>
  )
}

export default UserList;
