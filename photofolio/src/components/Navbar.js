import React from "react";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './Navbar.css'
import homeIcon from '../icons/Home.svg'
import newIcon from '../icons/New.svg'
import profileIcon from '../icons/Person.svg'
import logoutIcon from '../icons/Arrow_Export.svg'
function Navbar(props) {
  return (
    <Router>
      <nav className="Navbar">
        <ul>
          <li>
            <Link to={`/logout`}>
              <img src={logoutIcon} alt='logout'></img>Log Out
            </Link>
          </li>
          <li>
            <Link to={`/profile`}>
              <img src={profileIcon} alt='profile'></img>Profile
            </Link>
          </li>
          <li>
            <img src={newIcon} alt='new' onClick={() => props.setPostModalOpen(o => !o)}></img>New Post
          </li>
          <li>
            <Link to={`/home`}>
              <img src={homeIcon} alt='home'></img>Home
            </Link>
          </li>
        </ul>
      </nav>
    </Router>
  )
}


export default Navbar;