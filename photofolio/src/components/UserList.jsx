import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserRow from './UserRow';
import defaultAvatar from '../images/defaultAvatar.png';
import { rootUrl } from './Config';

function UserList() {
  const numUser = 6;
  const [users, setUsers] = useState([]);

  const genDummyUsers = (num) => {
    const dummyUsers = [];
    for (let index = 0; index < num; index += 1) {
      dummyUsers.push({
        avatar: defaultAvatar,
        firstName: '',
        lastName: '',
        id: 10000 + index
      });
    }
    return dummyUsers;
  };

  const getUsers = async (num) => {
    try {
      const response = await axios.get(`${rootUrl}/users?limit=${numUser}`);
      const usersData = response.data.slice(1, numUser + 1); // reserve id=1 for the current logged in user
      const dummyUsers = genDummyUsers(num - usersData.length);
      setUsers([...usersData, ...dummyUsers]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => setUsers(genDummyUsers(numUser)), []);
  useEffect(() => {
    getUsers(6);
    return () => {
      setUsers([genDummyUsers(numUser)]);
    };
  }, []);

  return users.map((user) => (
    <div className="user-row-card" key={user.id}>
      <UserRow
        avatar={user.avatar}
        name={`${user.firstName} ${user.lastName}`}
        userId={user.id}
        showFollow
      />
    </div>
  ));
}

export default UserList;
