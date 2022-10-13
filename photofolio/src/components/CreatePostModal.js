import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import UserRow from './UserRow';
import uploadArrorw from '../images/uploadArrow.png'
import avatar1 from '../images/avatar1.png'

function CreatePostModal() {
  const defaultTitle = 'Title…';
  const defaultCaption = 'Caption…';
  const [title, setTitle] = useState(defaultTitle);
  const [caption, setCaption] = useState(defaultCaption);
  const user = {profilePicUrl: avatar1, name: "Alfonso Schleifer"};
  return (
    <Popup
      className='create-post-modal modal'
      trigger={<button className="button"> New Post </button>}
      modal
      // position="center"
    >
      {close => (
        <div>
          <button className="modal-close-button" onClick={close}>
            &times;
          </button>
          <div className="modal-header">CREATING A POST</div>
          <div className="content">
            {/* TODO: Replace with a Component <UploadButton> */}
            <div>
              <button className='upload-arrow-button'>
                <img src={uploadArrorw} width={"30px"}/>
              </button></div>
            <div><button className='primary-button'>Upload A File</button></div>
            <UserRow profilePicUrl={user.profilePicUrl} name={user.name} ring={true}/>
            <div>
              <input
                className='modal-input gray-text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => {if (title===defaultTitle) {setTitle("")}}}
                onBlur={() => {if (title=="") {setTitle(defaultTitle)}}}
              />
            </div>
            <hr/>
            <div>
              <input
                className='modal-input gray-text'
                aria-multiline={true}       
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onFocus={() => {if (caption===defaultCaption) {setCaption("")}}}
                onBlur={() => {if (caption==="") {setCaption(defaultCaption)}}}
              />
            </div>
          </div>
          <hr/>
          <div className="actions center">
            <button 
              className="secondary-button"
              onClick={() => {
                console.log('Post Created');
                close();
              }}
            > Post </button>
          </div>
        </div>
      )}
    </Popup>
  )
}

export default CreatePostModal;