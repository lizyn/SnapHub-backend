import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProfilePage.css';
import { Avatar, Fab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CreatePostModal from './CreatePostModal';

import likeIcon from '../icons/Like.svg';
import followerIcon from '../icons/People.svg';
import NewIcon from '../icons/New.svg';
// import userMe from '../images/userMe.jpg';
import { fetchPhotos } from '../api/axios';

function ProfilePage(props) {
  ProfilePage.propTypes = {
    closePostModal: PropTypes.func.isRequired,
    postModalIsOpen: PropTypes.bool.isRequired,
    setPostModalOpen: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
  };

  const { closePostModal, postModalIsOpen, setPostModalOpen, setAlert } = props;

  const user = {
    name: 'Tatiana Dokidis',
    userId: 1,
    userProfile:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/119.jpg'
  };

  // const itemData = [
  //   {
  //     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  //     title: 'Breakfast'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  //     title: 'Burger'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
  //     title: 'Camera'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  //     title: 'Coffee'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  //     title: 'Hats'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  //     title: 'Honey'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
  //     title: 'Basketball'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
  //     title: 'Fern'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
  //     title: 'Mushrooms'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
  //     title: 'Tomato basil'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  //     title: 'Sea star'
  //   },
  //   {
  //     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
  //     title: 'Bike'
  //   }
  // ];

  // const [userPosts, setUserPosts] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    setPhotos([]);

    async function fetchPhotoData() {
      const photoData = await fetchPhotos(user.userId);
      setPhotos(photoData);
    }
    fetchPhotoData();
  }, []);

  const orange = createTheme({
    status: {
      danger: '#e53e3e'
    },
    palette: {
      primary: {
        main: '#FFDD2B',
        darker: '#000'
      },
      neutral: {
        main: '#FFDD2B',
        contrastText: '#FFF'
      }
    }
  });

  return (
    <div>
      <CreatePostModal
        closeModal={closePostModal}
        open={postModalIsOpen}
        setAlert={setAlert}
      />
      <div className="profileMain">
        <div className="profileUser">
          <Avatar
            alt="me"
            className="Avatar"
            src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1185.jpg"
            sx={{ width: 100, height: 100 }}
          />
          <div className="profileDes">
            <p>Tatiana Dokidis</p>
            <p>
              Hello, I am a free-lance photographer who loves capturing
              lanscapes and nature. I post new pictures as I travel around the
              world.{' '}
            </p>
          </div>
        </div>
        <div className="profileStats">
          <div className="followerStats">
            <div>
              <img src={likeIcon} alt="like" />
              <p>348 Likes</p>
            </div>
            <div>
              <img src={followerIcon} alt="followers" />
              <p>2,390 Followers</p>
            </div>
            <div>
              <img src={followerIcon} alt="followers" />
              <p>Following</p>
            </div>
          </div>
          <div className="newpost">
            <ThemeProvider theme={orange}>
              <Fab
                variant="extended"
                color="primary"
                sx={{ zIndex: 999 }}
                onClick={() => setPostModalOpen((o) => !o)}
              >
                <img src={NewIcon} className="newPostSign" alt="new" />
                New Post
              </Fab>
            </ThemeProvider>
          </div>
        </div>

        <div className="profileActivity">
          <ImageList
            sx={{ width: 1100, height: 300, overflow: 'hidden' }}
            cols={3}
            gap={0}
          >
            {photos.map((item) => (
              <ImageListItem
                key={item.id}
                sx={{ width: '95% !important', height: '90% !important' }}
              >
                <img
                  src={`${item.src}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.alt}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
