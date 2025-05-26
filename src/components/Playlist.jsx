import Track from "./Track";
import styles from "../styles/Playlist.module.css";

export default function Playlist({ playlists, tracks = [], onSelectPlaylist }) {
  return (
    <div className={`container border rounded ${styles.playlist}`}>
      <div className="row">
        <div className="col">
          <h5>PlayList</h5>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <select
            className="form-select"
            onChange={(e) => {
              onSelectPlaylist(e.target.value);
            }}
          >
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>{" "}
        </div>
      </div>
      {tracks.map((track, i) => (
        <Track key={`track-${i}`} track={track} />
      ))}
    </div>
  );
}
