import React, { Component } from 'react';
import UsersToFollow from './UsersToFollow';

function FollowRecommendation(props) {
  return (
      <div>
        Recommended for you
        <UsersToFollow/>
      </div>   
  )
}

export default FollowRecommendation;
