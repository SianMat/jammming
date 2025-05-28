export default function SearchBar({
  searchTerm,
  setSearchTerm,
  playlists = [],
  onSelectPlaylist,
  onSearch,
  onAddNewPlaylist,
  newPlaylist,
  playlistId,
  loggedIn,
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
        <button onClick={onSearch} className="btn btn-primary">
          Search
        </button>
      </div>
      {loggedIn ? (
        <div className="col d-flex">
          <select
            className="form-select"
            value={playlistId}
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
          <button onClick={onAddNewPlaylist} className="btn btn-primary">
            {newPlaylist ? "Cancel" : "New"}
          </button>
        </div>
      ) : (
        <div className="col d-flex">
          <p>Please log in to see your playlists</p>
        </div>
      )}
    </div>
  );
}
