import Track from "./Track";
import styles from "../styles/Playlist.module.css";
import { useEffect, useState } from "react";

export default function Playlist({
  playlistName = "",
  setPlaylistName,
  playlist,
  removedTracks = [],
  onDeleteTrack,
  addedTracks,
  onRemoveAddedTrack,
  onSave,
  onDeletePlaylist,
}) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setTracks(playlist ? playlist.map((item) => item.track) : []);
  }, [playlist]);

  useEffect(() => {
    if (playlist) {
      setTracks(() =>
        playlist
          .map((item) => item.track)
          .filter((track) => !removedTracks.map((t) => t.id).includes(track.id))
      );
    }
  }, [removedTracks]);

  return (
    <div className={`container border rounded ${styles.playlist}`}>
      <div className="row">
        <div className="col d-flex align-items-end gap-2 mb-2">
          <h5>PlayList</h5>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist Name"
            className="form-control"
          />
          <button onClick={onSave} className="btn btn-primary">
            Update
          </button>
        </div>
      </div>
      <div className="col">
        {addedTracks.map((track, i) => (
          <Track
            onButtonClick={onRemoveAddedTrack}
            inPlaylist={true}
            key={`track-${i}`}
            track={track}
          />
        ))}
        {tracks.map((track, i) => (
          <Track
            onButtonClick={onDeleteTrack}
            inPlaylist={true}
            key={`track-${i}`}
            track={track}
          />
        ))}
      </div>
      <div className="col d-flex justify-content-center">
        <button onClick={onDeletePlaylist} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
