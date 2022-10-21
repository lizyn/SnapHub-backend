import React, { useState, useRef, useEffect } from 'react';
import Feed from './Feed';
import { fetchPosts, fetchPhotos } from '../api/axios';

function FeedList() {
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const postId = useRef(0);
  const firstRendering = useRef(true);

  useEffect(() => {
    async function fetchData() {
      const postsData = await fetchPosts();
      setPosts(postsData);
      const photoData = await fetchPhotos();
      setPhotos(photoData);
    }

    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  const postsList = posts;
  const photoList = photos;

  console.log(posts);
  const populateFeeds = () => {
    const feeds = [];
    postsList.forEach((post) => {
      const photo = photoList.filter((x) => x.postId === post.id);
      feeds.push(<Feed title={post.title} img={photo.src} key={post.id} />);
      postId.current += 1;
    });
    return feeds;
  };

  const feeds = populateFeeds();

  return <div>{feeds}</div>;
}

export default FeedList;
