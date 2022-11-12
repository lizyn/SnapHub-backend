import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import {
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  CardMedia
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from '../api/axios';
import UserRow from './UserRow';
import { rootUrl } from './Config';
import uploadArrow from '../images/uploadArrow.png';

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

export default function EditPostModal(props) {
  EditPostModal.propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    postId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired
  };

  const { open, closeModal, setAlert, postId, title, img } = props;

  const [editTitle, setEditTitle] = useState(title);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(img);
  const [submit, setSubmit] = useState(false);
  const [fileType, setFileType] = useState('img');

  const user = {
    name: 'Tatiana Dokidis',
    userId: 1
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setFile(URL.createObjectURL(newFile));
    if (newFile.type.startsWith('image')) {
      setFileType('img');
      setSubmit(true);
    } else {
      setFileType('video');
      setSubmit(true);
    }
  };

  const uploadPost = async () => {
    const params = {
      editTitle,
      caption,
      userId: user.id,
      photos: ['https://example.org/image']
    };
    try {
      console.log(postId);
      const response = await axios.put(`${rootUrl}/posts/${postId}`, params);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    closeModal();
    setEditTitle('');
    setCaption('');
    setFile();
    uploadPost();
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
              <div className="modal-header">Editing a post</div>
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
                      name="file1"
                      id="file1"
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
                    name="file2"
                    id="file2"
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
              <UserRow name={user.name} userId={1} ring />
              <Box sx={{ mx: 2 }}>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <TextField
                    // margin="normal"
                    fullWidth
                    id="post-title"
                    placeholder={title}
                    name="title"
                    autoFocus
                    size="small"
                    variant="standard"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
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
                  id="submit"
                  type="submit"
                  variant="contained"
                  disabled={!submit}
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
