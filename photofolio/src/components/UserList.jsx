import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserRow from './UserRow';
import defaultAvatar from '../images/defaultAvatar.png';
import { rootUrl } from './Config';

function UserList() {
  const currentUserId = 1;
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
      const response = await axios.get(
        `${rootUrl}/follower-suggestions?userId=${currentUserId}&limit=${numUser}`
      );
      const usersData = response.data[0].suggestedUsers.slice(0, numUser);
      const dummyUsers = genDummyUsers(num - usersData.length);
      setUsers([...usersData, ...dummyUsers]);
      // return response;
    } catch (err) {
      // return err;
      setUsers(genDummyUsers(num));
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
