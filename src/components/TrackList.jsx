import styles from "../styles/TrackList.module.css";
import Track from "./Track";

export default function TrackList({ tracks }) {
  return (
    <div className={`container border rounded ${styles.tracklist}`}>
      <div className="row">
        <div className="col">
          <h5>Results</h5>
        </div>
      </div>
      {tracks.map((track, i) => (
        <Track key={`track-${i}`} track={track} />
      ))}
    </div>
  );
}
