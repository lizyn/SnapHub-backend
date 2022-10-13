import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import UserRow from './UserRow';
import uploadArrow from '../images/uploadArrow.png'
import avatar1 from '../images/avatar1.png'


function handleUpload() {
  console.log("file uploaded");
}

function CreatePostModal(props) {
  const defaultTitle = 'Title…';
  const defaultCaption = 'Caption…';
  const [title, setTitle] = useState(defaultTitle);
  const [caption, setCaption] = useState(defaultCaption);

  const user = {profilePicUrl: avatar1, name: "Alfonso Schleifer"};

  return (
    <div>
      <Popup open={props.open} closeOnDocumentClick onClose={props.closeModal}>
          <div style={{margin: "2em"}}>
            <button 
              className="transparent-button modal-close-button"
              onClick={props.closeModal}
            >
              &times;
            </button>
            <div className="modal-header">creating a post</div>
            <div className="content">
              <div>
                <button 
                  className='upload-arrow-button'
                  onClick={handleUpload}
                >
                  <img src={uploadArrow} alt="upload arrow" width={"30px"}/>
                </button></div>
              <div>
                <button 
                  className='primary-button'
                  onClick={handleUpload}
                >
                  Upload A File
                </button>
              </div>
              <UserRow profilePicUrl={user.profilePicUrl} name={user.name} ring={true}/>
              <div>
                <input
                  className='modal-input gray-text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => {if (title===defaultTitle) {setTitle("")}}}
                  onBlur={() => {if (title==="") {setTitle(defaultTitle)}}}
                />
              </div>
              <hr/>
              <div>
                <textarea
                  className='modal-input gray-text'
                  style={{height: "10em"}}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onFocus={() => {if (caption===defaultCaption) {setCaption("")}}}
                  onBlur={() => {if (caption==="") {setCaption(defaultCaption)}}}
                />
              </div>
              <hr/>
              <div>
                <input
                  value={"Add Tags…"}
                  onChange={e=>e}
                />
                <div>
                  <button>
                    #Beach
                  </button>
                  <button>
                    #EmbraceNature
                  </button>
                </div>
              </div>
              <hr/>
            </div>
            <div className="actions center">
              <button 
                className="secondary-button"
                onClick={() => {
                  console.log('Post Created');
                }}
              > 
                Post 
              </button>
            </div>
          </div>
      </Popup>
    </div>
  )
}

export default CreatePostModal;
