import React from 'react';
import PropTypes from 'prop-types';
import UserRow from './UserRow';

function UserList(props) {
  UserList.propTypes = {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        profilePicUrl: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
      })
    ),
    showFollow: PropTypes.bool.isRequired
  };
  UserList.defaultProps = {
    users: []
  };

  const userRows = [];
  const { users, showFollow } = props;
  users.forEach((user) => {
    userRows.push(
      <div className="user-row-card" key={user.id}>
        <UserRow
          profilePicUrl={user.profilePicUrl}
          name={user.name}
          showFollow={showFollow}
        />
      </div>
    );
  });
  return <div>{userRows}</div>;
}

export default UserList;
