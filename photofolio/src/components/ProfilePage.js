import React from 'react';
import Navbar from './Navbar';
import "./ProfilePage.css";
import { Avatar } from '@mui/material';
import userMe from "../images/userMe.jpg"
import Fab from "@mui/material/Fab";
import NewIcon from '../icons/New.svg';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import likeIcon from '../icons/Like.svg';
import followerIcon from "../icons/People.svg";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CreatePostModal from "./CreatePostModal";

function ProfilePage(props) {

  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
  ];

  const orange = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#FFDD2B',
        darker: '#000',
      },
      neutral: {
        main: '#FFDD2B',
        contrastText: '#FFF',
      },
    },
  });

  return (
    <div>
      {/* <Navbar /> */}
      <CreatePostModal closeModal={props.closePostModal} open={props.postModalIsOpen} />
      <div className="profileMain">
        <div className="profileUser">
          <Avatar alt='me' className="Avatar" src={userMe} sx={{ width: 100, height: 100 }}></Avatar>
          <div className="profileDes">
            <p>Tatiana Dokidis</p>
            <p>Hello, I am a free-lance photographer who loves capturing lanscapes and nature. I  post new pictures as I travel around the world. </p>
          </div>
        </div>
        <div className="profileStats">
          <div className="followerStats">
            <div>
              <img src={likeIcon} alt="like"></img>
              <p>348 Likes</p>
            </div>
            <div>
              <img src={followerIcon} alt="followers"></img>
              <p>2,390 Followers</p>
            </div>
            <div>
              <img src={followerIcon} alt="followers"></img>
              <p>Following</p>
            </div>
          </div>
          <div>
          </div>
          <div className="newpost" onClick={() => props.setPostModalOpen(o => !o)}>
            <ThemeProvider theme={orange}>
              <Fab variant="extended" color="primary" sx={{}}><img src={NewIcon} className="newPostSign" alt="new"></img>New Post</Fab>
            </ThemeProvider>
          </div>
          {/* <div className="newpost" onClick={() => props.setPostModalOpen(o => !o)}>
              <ThemeProvider theme={orange}>
                <Fab variant="extended" color="primary" sx={{ mb: 20 }}><img src={NewIcon} className="newPostSign" alt="new"></img>New Post</Fab>
              </ThemeProvider>
            </div> */}
        </div>

        <div className="profileActivity">
          <ImageList sx={{ width: 1100, height: 1500, overflow: "hidden" }} cols={3} gap={0}>
            {itemData.map((item) => (
              <ImageListItem key={item.img} sx={{ width: "95% !important", height: "95% !important" }}>
                <img
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  )

}

export default ProfilePage;