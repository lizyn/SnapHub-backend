import React, { useState, useRef, useEffect } from 'react';
import Feed from './Feed';
import { fetchPosts, fetchPhotos, fetchUsers } from '../api/axios';

function FeedList() {
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const postId = useRef(0);
  const firstRendering = useRef(true);

  useEffect(() => {
    async function fetchData() {
      const postsData = await fetchPosts();
      setPosts(postsData);
    }

    async function fetchPhotoData() {
      const photoData = await fetchPhotos();
      setPhotos(photoData);
    }

    async function fetchUserData() {
      const photoData = await fetchUsers();
      setUsers(photoData);
    }

    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
      fetchPhotoData();
      fetchUserData();
    }
  });

  const postsList = posts;
  const photoList = photos;
  const userList = users;
  // console.log(userList);
  const populateFeeds = () => {
    const feeds = [];
    postsList.forEach((post) => {
      const photo = photoList.find((x) => x.postId === post.id);
      const user = userList.find((x) => x.id === post.userId);
      feeds.push(
        <Feed
          author={`${user.firstName} ${user.lastName}`}
          img={photo.src}
          key={post.id}
          avatar={user.avatar}
          likes={post.likes}
          commentIds={post.comments}
          title={post.title}
        />
      );
      postId.current += 1;
    });
    return feeds;
  };

  const feeds = populateFeeds();

  return <div>{feeds}</div>;
}

export default FeedList;
