import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import UserRow from './UserRow';
import uploadArrow from '../images/uploadArrow.png'
import avatar1 from '../images/avatar1.png'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';


function handleUpload() {
  console.log("file uploaded");
}

function handleSubmit() {
  console.log("submitted");
}

const theme = createTheme({
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

export default function CreatePostModal(props) {
  const defaultTitle = 'Title…';
  const defaultCaption = 'Caption…';
  const [title, setTitle] = useState(defaultTitle);
  const [caption, setCaption] = useState(defaultCaption);

  const user = { profilePicUrl: avatar1, name: "Alfonso Schleifer" };

  return (
    <Popup open={props.open} closeOnDocumentClick onClose={props.closeModal}>
      <ThemeProvider theme={theme}>
        <Grid container>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="modal-header">creating a post</div>
              <Box textAlign='center' sx={{ my: 16 }}>
                <Button
                  // className='upload-arrow-button'
                  variant='outlined'
                  onClick={handleUpload}
                >
                  <img src={uploadArrow} alt="upload arrow" width={"30px"} />
                </Button>
              </Box>
              <Grid container justifyContent="center">
                <Button
                  variant='contained'
                  onClick={handleUpload}
                  sx={{ float: 'bottom' }}
                >
                  Upload A File
                </Button>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={5} sx={{ borderLeft: 1 }}>
            <Button
              // className="transparent-button modal-close-button"
              onClick={props.closeModal}
              sx={{ float: "right", fontSize: "24px" }}
            >
              &times;
            </Button>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <UserRow profilePicUrl={user.profilePicUrl} name={user.name} ring={true} />
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <TextField
                  // margin="normal"
                  fullWidth
                  id="post-title"
                  label="Title…"
                  name="title"
                  autoFocus
                  size='small'
                  variant='standard'
                />
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={8}
                  name="caption"
                  label="Caption…"
                  id="post-caption"
                  size='small'
                  variant='standard'
                />
              </Box>
              {/* <div>
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
              <hr/> */}
              <Box
                sx={{ zoom: '80%', mt: '.5em' }}
              >
                <TextField id="tags" label="Add Tags…" size="small" variant="outlined" sx={{ mb: '.5em' }} />
                <Box>
                  <Chip label='#Beach' />
                  <Chip label='#EmbraceNature' />
                </Box>
              </Box>
              {/* <Divider light={false}/> */}
              <Grid container justifyContent="center">
                <Button
                  type="submit"
                  variant="contained" disabled
                  // className="secondary-button"
                  onClick={() => {
                    console.log('Post Created');
                  }}
                  sx={{ mt: '1em' }}
                >
                  Post
                </Button>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Popup>
  );
}
