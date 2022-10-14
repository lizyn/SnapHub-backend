import React from "react";
import Navbar from "./Navbar";
import './HomePage.css'
import { Avatar } from "@mui/material";
import userMe from "../images/userMe.jpg";
import searchIcon from '../icons/Search.svg'
import NewIcon from '../icons/New.svg'
import Fab from "@mui/material/Fab";
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FeedList from "./FeedList";
import CreatePostModal from "./CreatePostModal";
import FollowRecommendation from "./FollowRecommendation";


function HomePage(props) {

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
    <div className="flex1">
      <Navbar {...props} />
      <CreatePostModal closeModal={props.closePostModal} open={props.postModalIsOpen} />
      <div className="main">
        <div className="users-section">
          <div className="user">
            <Avatar alt='me' className="Avatar" src={userMe} sx={{ width: 100, height: 100 }}></Avatar>
            <h3>Tatiana Dokidis</h3>
          </div>
          <div className="recommendations">
            <p>Recommended for you</p>
            <div className="userList">
              <p>Recommneded Users to follow</p>
              <FollowRecommendation />
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="right-top">
            <div className="searchbar">
              <input type="text" placeholder="Tag, user, etc..." name="search"></input>
              <button type="submit"><img src={searchIcon} alt="search"></img> Search </button>
            </div>
            <div className="newpost" onClick={() => props.setPostModalOpen(o => !o)}>
              <ThemeProvider theme={orange}>
                <Fab variant="extended" color="primary" sx={{ mb: 20 }}><img src={NewIcon} className="newPostSign" alt="new"></img>New Post</Fab>
              </ThemeProvider>
            </div>
          </div>

          <div className="feed">
            <FeedList></FeedList>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;