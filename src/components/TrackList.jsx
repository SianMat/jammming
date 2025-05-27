import { useState, useEffect } from "react";
import styles from "../styles/TrackList.module.css";
import Track from "./Track";

export default function TrackList({
  tracksFromSearch = [],
  addedTracks,
  removedTracks,
  onAddTrack,
  onAddRemovedTrack,
}) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setTracks(tracksFromSearch);
  }, [tracksFromSearch]);

  useEffect(() => {
    setTracks(() =>
      tracksFromSearch.filter(
        (track) => !addedTracks.map((t) => t.id).includes(track.id)
      )
    );
  }, [addedTracks]);

  return (
    <div className={`container border rounded ${styles.tracklist}`}>
      <div className="row">
        <div className="col d-flex align-items-end gap-2 mb-2">
          <h5>Results</h5>
        </div>
      </div>
      {removedTracks.map((track, i) => (
        <Track
          key={`track-${i}`}
          track={track}
          onButtonClick={onAddRemovedTrack}
        />
      ))}
      {tracks.map((track, i) => (
        <Track key={`track-${i}`} track={track} onButtonClick={onAddTrack} />
      ))}
    </div>
  );
}
