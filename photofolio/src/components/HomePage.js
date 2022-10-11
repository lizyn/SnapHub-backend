import React from "react";
import Navbar from "./Navbar";
import './HomePage.css'

function HomePage(){

    return(
        <div className="flex1">
            <Navbar/>
            <h1>1</h1>
            <h1>Homepage </h1>
            <div>
            <div className="avatar"></div>
            </div>
        </div>
    )
}

export default HomePage;