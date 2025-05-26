import styles from "../styles/SearchBar.module.css";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  playlists = [],
  onSelectPlaylist,
}) {
  return (
    <div className="row py-3">
      <div className="col d-flex gap-2">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="form-control"
        />
        <button className="btn btn-primary">Search</button>
      </div>
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
        </select>
      </div>
    </div>
  );
}
