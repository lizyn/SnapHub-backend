import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
import { TextField } from '@mui/material';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
// import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import UserRow from './UserRow';
import uploadArrow from '../images/uploadArrow.png';
import avatar4 from '../images/avatar4.png';
// import post1 from '../images/post1.jpg';

const theme = createTheme({
  status: {
    danger: '#e53e3e'
  },
  palette: {
    primary: {
      main: '#FFDD2B',
      darker: '#000'
    },
    neutral: {
      main: '#FFDD2B',
      contrastText: '#FFF'
    }
  }
});

export default function CreatePostModal(props) {
  CreatePostModal.propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
  };

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState('img');
  const user = { avatar: avatar4, name: 'Tatiana Dokidis' };
  const { open, closeModal, setAlert } = props;

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setFile(URL.createObjectURL(newFile));
    if (newFile.type.startsWith('image')) {
      setFileType('img');
    } else {
      setFileType('video');
    }
    // console.log(newFile);
  };

  const handleSubmit = () => {
    // console.log('submitted');
    closeModal();
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  };

  return (
    <Popup open={open} closeOnDocumentClick onClose={closeModal}>
      <ThemeProvider theme={theme}>
        <Grid container>
          <Grid item xs={false} sm={4} md={7}>
            <Box
              justifyContent="center"
              sx={{
                mb: 8,
                mt: 2,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '90%'
              }}
            >
              <div className="modal-header">creating a post</div>
              <Box
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                sx={{
                  my: 6,
                  mx: 2,
                  margin: 'auto',
                  display: 'flex',
                  maxHeight: '70%'
                }}
              >
                {
                  file && (
                    <CardMedia
                      component={fileType}
                      controls={fileType === 'video'}
                      src={file}
                      style={{
                        height: '100%',
                        maxWidth: '100%',
                        borderRadius: '3px'
                      }}
                    />
                  )
                  // <img src={file} style={{ height: '100%', maxWidth: '100%', borderRadius: '3px' }} />
                }
                {!file && (
                  <Button variant="outlined" component="label">
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/x-m4v,video/*"
                      hidden
                      onChange={handleFileChange}
                    />
                    <img
                      src={uploadArrow}
                      alt="upload arrow"
                      width="30px"
                      style={{ margin: 'auto', display: 'flex' }}
                    />
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex' }} justifyContent="center">
                <Button
                  variant="contained"
                  component="label"
                  sx={{ float: 'bottom' }}
                >
                  Upload A File
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/x-m4v,video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            sx={{ borderLeft: 1, borderColor: '#D2D2D2' }}
          >
            <Button
              onClick={closeModal}
              sx={{ float: 'right', fontSize: '24px' }}
            >
              &times;
            </Button>
            <Box
              sx={{
                mt: 8,
                mb: 3,
                mx: 4,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <UserRow avatar={user.avatar} name={user.name} ring />
              <Box sx={{ mx: 2 }}>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <TextField
                    // margin="normal"
                    fullWidth
                    id="post-title"
                    label="Title…"
                    name="title"
                    autoFocus
                    size="small"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    minRows={8}
                    maxRows={12}
                    name="caption"
                    label="Caption…"
                    id="post-caption"
                    size="small"
                    variant="standard"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
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
                </div> */}
                <Box sx={{ zoom: '80%', mt: 1, mb: 8 }}>
                  <TextField
                    id="tags"
                    label="Add Tags…"
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box>
                    <Chip label="#Beach" />
                    <Chip label="#EmbraceNature" />
                  </Box>
                </Box>
                <Divider sx={{ bgcolor: '#D2D2D2' }} />
              </Box>
              <Box sx={{ display: 'flex' }} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={file === undefined}
                  onClick={handleSubmit}
                  sx={{ mt: 2, px: 5 }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Popup>
  );
}
