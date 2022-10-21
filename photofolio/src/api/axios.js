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

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
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
