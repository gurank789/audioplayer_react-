import React, { useRef, useState, useEffect } from 'react';
import { useTheme, Slider, Typography, Grid, IconButton, Box, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

const PrettoSlider = (props) => (
  <Slider
    {...props}
    sx={{
      root: {
        color: '#52af77',
        height: 10,
      },
      thumb: {
        height: 24,
        width: 30,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
          boxShadow: 'inherit',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
      },
      track: {
        height: 8,
        borderRadius: 4,
      },
      rail: {
        height: 8,
        borderRadius: 4,
      },
    }}
  />
);

const AudioPlayer = React.forwardRef(({ playlist }, ref) => {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');

  const theme = useTheme();
  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)';
  const lightIconColor = theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.54)';

  useEffect(() => {
    if (ref) {
      ref.current = {
        playSelectedTrack: (index) => setCurrentTrackIndex(index),
        loadLastPlayedInfo,
      };
    }
  }, [ref]);

  useEffect(() => {
    loadLastPlayedInfo();
  }, []);

  useEffect(() => {
    localStorage.setItem('lastPlayedIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const loadLastPlayedInfo = () => {
    const storedIndex = localStorage.getItem('lastPlayedIndex');
    const storedTime = localStorage.getItem('lastPlayedTime');

    if (storedIndex !== null && !isNaN(storedIndex)) {
      setCurrentTrackIndex(parseInt(storedIndex, 10));
    }

    if (storedTime !== null && !isNaN(storedTime) && audioRef.current) {
      audioRef.current.currentTime = parseFloat(storedTime);
      setCurrentTime(parseFloat(storedTime));
    }
  };

  const saveCurrentTime = () => {
    if (audioRef.current) {
      localStorage.setItem('lastPlayedTime', audioRef.current.currentTime);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const playPauseHandler = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolumeHandler = (e, newValue) => {
    setVolume(newValue / 100);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
    if (isMuted && newValue > 0) {
      setIsMuted(false);
    }
  };

  const toggleMuteHandler = () => {
    if (audioRef.current) {
      const newIsMuted = !isMuted;
      audioRef.current.volume = newIsMuted ? 0 : volume;
      setIsMuted(newIsMuted);
    }
  };

  const nextTrackHandler = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const prevTrackHandler = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length
    );
  };

  const endedHandler = () => {
    saveCurrentTime();
    nextTrackHandler();
  };

  const timeUpdateHandler = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', endedHandler);
      audioRef.current.addEventListener('timeupdate', timeUpdateHandler);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', endedHandler);
        audioRef.current.removeEventListener('timeupdate', timeUpdateHandler);
      }
    };
  }, [endedHandler, timeUpdateHandler]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('canplay', (event) => {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error.message);
        });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', (event) => {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error.message);
          });
        });
      }
    };
  }, [playlist, currentTrackIndex]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      
      <Box
        sx={{
          padding: 10,
          borderRadius: 10,
          width: 343,
          maxWidth: '100%',
          margin: 'auto',
          position: 'relative',
          zIndex: 1,
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(40px)',
          
         
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <IconButton aria-label="previous song" onClick={prevTrackHandler}>
              <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
            <IconButton aria-label={isPlaying ? 'pause' : 'play'} onClick={playPauseHandler}>
              {isPlaying ? (
                <PauseIcon sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
              )}
            </IconButton>
            <IconButton aria-label="next song" onClick={nextTrackHandler}>
              <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {playlist[currentTrackIndex]?.artist}
            </Typography>
            <Typography noWrap>
              <b>{playlist[currentTrackIndex]?.title}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              {playlist[currentTrackIndex]?.album} — {playlist[currentTrackIndex]?.title}
            </Typography>
          </Grid>
        </Grid>
        
        <PrettoSlider
          aria-label="time-indicator"
          size="small"
          value={currentTime}
          min={0}
          step={10}
          max={duration}
          onChange={(_, value) => setCurrentTime(value)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 8,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 30,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formatTime(duration)}
          </Typography>
        </Grid>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton onClick={toggleMuteHandler} aria-label="mute">
              {isMuted ? (
                <VolumeOffIcon fontSize="small" htmlColor={lightIconColor} />
              ) : volume > 0.5   ? (
                <VolumeUpIcon fontSize="small" htmlColor={lightIconColor} />
              ) : (
                <VolumeDownRounded fontSize="small" htmlColor={lightIconColor} />
              )}
            </IconButton>
            <PrettoSlider
              aria-label="volume-slider"
              size="small"
              value={isMuted ? 0 : volume * 100}
              min={0}
              step={1}
              max={100}
              onChange={changeVolumeHandler}
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                height: 10,
                '& .MuiSlider-thumb': {
                  width: 10,
                  height: 6,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${
                      theme.palette.mode === 'dark'
                        ? 'rgb(255 255 255 / 16%)'
                        : 'rgb(0 0 0 / 16%)'
                    }`,
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28,
                },
              }}
            />
           
          </Grid>
          <Grid item>
            <audio
              ref={audioRef}
              src={playlist[currentTrackIndex]?.audio}
              onEnded={endedHandler}
              preload="metadata"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export default AudioPlayer;