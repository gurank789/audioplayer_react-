import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Playlist.css'; // Import CSS file

const Playlist = ({ playlist, onSongClick, onSongDelete }) => {
  return (
    <List className="playlist"> {/* Apply class */}
      {playlist.map((song) => (
        <ListItem key={song.id} button onClick={() => onSongClick(song.id)} className="listItem"> {/* Apply class */}
          <ListItemText primary={song.title} secondary={song.artist} />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => onSongDelete(song.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default Playlist;