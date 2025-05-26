import styles from "../styles/Track.module.css";

export default function Track({ track, inPlaylist, onButtonClick }) {
  return (
    <div className="row my-2">
      <div className="col">
        <div className={`card ${styles.track}`}>
          <div className="card-header d-flex justify-content-between">
            {track.name}
            <button
              className="btn btn-sm btn-primary align-self-end"
              onClick={() => onButtonClick(track.id)}
            >
              {inPlaylist ? "delete" : "add"}
            </button>
          </div>
          <div className="card-body">
            <h6 className="card-title">
              {track.artists.map((artist, i) => {
                if (i === track.artists.length - 1) {
                  return artist.name;
                }
                return `${artist.name}, `;
              })}
            </h6>
            <p className="card-text">{track.album.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
