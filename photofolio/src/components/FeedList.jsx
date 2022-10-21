import React, { useState, useRef, useEffect } from 'react';
import Feed from './Feed';

function FeedList() {
  const [posts, setPosts] = useState([]);
  const postId = useRef(0);
  const firstRendering = useRef(true);

  useEffect(() => {
    // get the list of students from the backend
    async function fetchData() {
      const postsData = await fetchPosts();
      setPosts(postsData);
    }
    // only load data on the first rendering or
    // when a new post is created
    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  const postsList = posts;
  const populateFeeds = () => {
    const feeds = [];
    postsList.forEach((post) => {
      feeds.push(
        <Feed title={post.text} img={post.photo.src} key={postId.current} />
      );
      postId.current += 1;
    });
    return feeds;
  };

  const feeds = populateFeeds();

  return <div>{feeds}</div>;
}

export default FeedList;
