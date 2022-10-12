import React from "react";
import './Feed.css'
import post1 from '../images/post1.jpg'
import { Avatar } from "@mui/material";
import userOther1 from '../images/userOther1.jpg'
import likeIcon from '../icons/Like.svg'
import commentIcon from '../icons/Comment.svg'
import sendIcon from '../icons/Send.svg'
function Feed() {

    return(
        <div className="post">
            <div className="postHead">
            <Avatar alt='me' className="Avatar" src={userOther1} sx={{ width: 50, height: 50}}></Avatar>
            <p className="postUsername">Erin Rhiel Madsen</p>
            <p className="postTime">20 minutes ago</p>
            </div>
            <img src={post1} alt='post'></img>
            <div className="postActions">
            <div className="postStats">
                <div className="stats">
                    <img src={likeIcon} alt="like"></img>
                    <p>26 Likes</p>
                </div>
                <div className="stats">
                    <img src={commentIcon} alt="comment"></img>
                    <p>4 Comments</p>
                </div>
            </div>
            <div className="postComment">
                <button type="submit"><img src={sendIcon} alt="send comment"></img></button>
                <input type="text" placeholder="Post a comment" name="postComment"></input>
            </div>
            </div>
        </div>
    )
}

export default Feed;