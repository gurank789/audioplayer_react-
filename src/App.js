import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  Typography,
  Grid,
  Box, // Import the Box component
} from '@mui/material';
import AudioPlayer from './components/AudioPlayer';
import Playlist from './components/Playlist';

function App() {
  const [playlist, setPlaylist] = useState(() => {
    const storedPlaylist = localStorage.getItem('playlist');
    return storedPlaylist ? JSON.parse(storedPlaylist) : [];
  });

  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleFileUpload = () => {
    const files = fileInputRef.current.files;

    if (files.length > 0) {
      const newPlaylist = Array.from(files).map((file, index) => ({
        id: index + 1,
        title: file.name,
        audio: URL.createObjectURL(file),
      }));

      setPlaylist((prevPlaylist) => [...prevPlaylist, ...newPlaylist]);

      // Display the selected file name for 3 seconds
      setSelectedFileName(files[0].name);
      setTimeout(() => setSelectedFileName(''), 3000);
    }
  };

  const handleSongClick = (songId) => {
    const selectedSongIndex = playlist.findIndex((item) => item.id === songId);
    if (selectedSongIndex !== -1) {
      setCurrentTrackIndex(selectedSongIndex);
    }
  };

  const handleSongDelete = (songId) => {
    setPlaylist((prevPlaylist) => {
      const updatedPlaylist = prevPlaylist.filter((song) => song.id !== songId);
      return updatedPlaylist;
    });
  };

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playSelectedTrack(currentTrackIndex);
    }
  }, [currentTrackIndex]);

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: 8 }}>
      <CssBaseline />
      
      <Box
        sx={{
          backgroundColor: '#4C9F94', // Set your desired background color
          padding: 4,
          borderRadius: 8,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
          overflow: 'hidden',
          background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
          transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
          '&::before': {
            content: '""',
            width: '140%',
            height: '140%',
            position: 'absolute',
            top: '-40%',
            right: '-50%',
            background: 'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
          },
          '&::after': {
            width: '100%',
            height: '140%',
            position: 'absolute',
            bottom: '-50%',
            left: '-30%',
            background: 'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
            transform: 'rotate(30deg)',
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography component="h1" variant="h5">
              Music player
            </Typography>
            {/* Style the Choose File button */}
            <label htmlFor="audio-upload">
              <Button
                variant="contained"
                component="span"
                sx={{ marginTop: 2, backgroundColor: '#3f51b5', color: '#fff' }}
              >
                Choose File
              </Button>
            </label>
            <input
              id="audio-upload"
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              multiple
              style={{ display: 'none' }} // Hide the input element
            />
            <Button variant="contained" onClick={handleFileUpload} sx={{ marginTop: 2, marginLeft: 1 }}>
              Add to Playlist
            </Button>
            {selectedFileName && (
              <Typography variant="body2" color="textSecondary">
                Selected: {selectedFileName}
              </Typography>
            )}
            <Playlist
              playlist={playlist}
              onSongClick={handleSongClick}
              onSongDelete={handleSongDelete}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AudioPlayer ref={audioPlayerRef} playlist={playlist} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;