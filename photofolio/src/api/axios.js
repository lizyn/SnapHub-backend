import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3500'
});

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`http://localhost:3500/posts`);
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
    const response = await axios.get(`http://localhost:3500/photos`);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
    return false;
  }
};
