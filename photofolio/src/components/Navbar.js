import React from "react";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './Navbar.css'
import homeIcon from '../icons/Home.svg'
import newIcon from '../icons/New.svg'
import profileIcon from '../icons/Person.svg'
import logoutIcon from '../icons/Arrow_Export.svg'
// import Button from '@mui/material/Button'

function Navbar(props) {
  return (
    <Router>
      <nav className="Navbar">
        <ul>
          <li>
            <Link to={`/logout`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={logoutIcon} alt='logout'></img>Log Out
            </Link>
          </li>
          <li>
            <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={profileIcon} alt='profile'></img>Profile
            </Link>
          </li>
          <li>
            <a onClick={() => props.setPostModalOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <img
                src={newIcon} alt='new'
              />
              New Post
            </a>
          </li>
          <li>
            <Link to={`/home`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={homeIcon} alt='home'></img>Home
            </Link>
          </li>
        </ul>
      </nav>
    </Router>
  )
}


export default Navbar;