import React from "react";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './Navbar.css'
import homeIcon from '../icons/Home.svg'
import newIcon from '../icons/New.svg'
import profileIcon from '../icons/Person.svg'
import logoutIcon from '../icons/Arrow_Export.svg'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
function Navbar () {

    return(
        <nav className="Navbar">
            <ul>
                <li><img src={logoutIcon} alt='logout'></img>Log Out</li>
                <li><img src={profileIcon} alt='profile'></img>Profile</li>
                <li><img src={newIcon} alt='new'></img>New Post</li>
                <li><img src={homeIcon} alt='home'></img>Home</li>
                
            </ul>
        </nav>
    )
}


export default Navbar;