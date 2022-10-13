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
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


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

  const user = {profilePicUrl: avatar1, name: "Alfonso Schleifer"};

  return (
    <Box>
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
                <div item className="modal-header">creating a post</div>
                <Box textAlign='center'>
                  <Button
                    // className='upload-arrow-button'
                    variant='outlined'
                    onClick={handleUpload}
                    sx={{my: 18, width: 10}}
                  >
                    
                    <img src={uploadArrow} alt="upload arrow" width={"30px"}/>
                  </Button>
                </Box>
                <Grid container justifyContent="center">
                  <Button 
                    variant='contained'
                    onClick={handleUpload}
                    sx={{float: 'bottom'}}
                  >
                    Upload A File
                  </Button>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={5}>
              <Button 
                // className="transparent-button modal-close-button"
                onClick={props.closeModal}
                sx={{float: "right", fontSize:"24px"}}
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
                    onChange={e=>e} // TODO
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
                <Button 
                  variant="contained" disabled
                  // className="secondary-button"
                  onClick={() => {
                    console.log('Post Created');
                  }}
                >
                  Post 
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>   
      </Popup>
    </Box>
  );
}


                {/* <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box> */}