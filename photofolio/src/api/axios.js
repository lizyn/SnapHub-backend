import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3500'
});

const baseURL = 'http://localhost:3500';
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${baseURL}/posts`);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const fetchPhotos = async () => {
  try {
    const response = await axios.get(`${baseURL}/photos`);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const fetchUsers = async (userId) => {
  let URL = `${baseURL}/users/`;
  if (userId) {
    URL = `${baseURL}/users/${userId}`;
  }
  try {
    const response = await axios.get(URL);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const fetchComments = async () => {
  try {
    const response = await axios.get(`${baseURL}/comments`);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const likePosts = async (postId, likeUpdate) => {
  try {
    const currentData = await axios.get(`${baseURL}/posts/${postId}`);
    const response = await axios.put(`${baseURL}/posts/${postId}`, {
      ...currentData.data,
      likes: likeUpdate
    });
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return err;
  }
};
