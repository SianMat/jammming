import { useState } from "react";
import "./App.css";
import TrackList from "../src/components/TrackList";
import Playlist from "./components/PlayList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Login from "./components/LogIn.jsx";
import { getPlaylists, getPlaylistById } from "./utils/FetchPlaylists.js";
import { searchSpotify } from "./utils/FetchTracks.js";
import { renamePlaylist } from "./utils/UpdatePlaylist.js";

function App() {
  const [profile, setProfile] = useState(null);

  const [tracks, setTracks] = useState([]); //tracks from searhc
  const [searchTerm, setSearchTerm] = useState("");
  const [playlists, setPlaylists] = useState([]); //list of all user playlists
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); //tracks of selected playlist
  const [playlistName, setPlayListName] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [addedTracks, setAddedTracks] = useState([]);
  const [removedTracks, setRemovedTracks] = useState([]);

  //search Spotify based on key word
  async function handleSearch() {
    const results = await searchSpotify(searchTerm);
    setTracks(results);
  }

  //fetch tracks for users selected playlist : defaults to top in list
  async function handleFetchPlaylist(playlist) {
    const playlistTracks = await getPlaylistById(playlist.id);
    setSelectedPlaylist(playlistTracks);
    setPlayListName(playlist.name);
    setPlaylistId(playlist.id);
    setAddedTracks([]);
    setRemovedTracks([]);
  }

  //fetch playlists of logged in user
  async function handleFetchPlaylists() {
    const results = await getPlaylists();
    setPlaylists(results);
    if (results.length > 0) {
      handleFetchPlaylist(results[0]);
    }
  }

  function handleDeleteTrack(trackId) {
    if (!removedTracks.map((t) => t.id).includes(trackId)) {
      setRemovedTracks((prev) => [
        selectedPlaylist
          .map((t) => t.track)
          .find((track) => track.id === trackId),
        ...prev,
      ]);
    }
  }

  function handleAddTrack(trackId) {
    if (!addedTracks.map((t) => t.id).includes(trackId)) {
      setAddedTracks((prev) => [
        tracks.find((track) => track.id === trackId),
        ...prev,
      ]);
    }
  }

  function handleRemoveAddedTrack(trackId) {
    setAddedTracks((prev) => prev.filter((track) => track.id !== trackId));
  }

  function handleAddRemovedTrack(trackId) {
    setRemovedTracks((prev) => prev.filter((track) => track.id !== trackId));
  }

  function handleRenamePlaylist() {
    const success = renamePlaylist(playlistId, playlistName);
    if (success) {
      setPlaylists((pls) => {
        return pls.map(
          (p) =>
            p.id === playlistId
              ? { ...p, name: playlistName } // create new updated playlist object
              : p // leave others untouched
        );
      });
    }
  }

  return (
    <div className="container">
      <Login
        getPlaylists={handleFetchPlaylists}
        profile={profile}
        setProfile={setProfile}
      />
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectPlaylist={handleFetchPlaylist}
        playlists={playlists}
        onSearch={handleSearch}
      />
      <div className="row">
        <div className="col">
          <TrackList
            tracksFromSearch={tracks}
            addedTracks={addedTracks}
            onAddTrack={handleAddTrack}
            removedTracks={removedTracks}
            onAddRemovedTrack={handleAddRemovedTrack}
          />
        </div>
        <div className="col">
          <Playlist
            playlistName={playlistName}
            setPlaylistName={setPlayListName}
            playlist={selectedPlaylist}
            removedTracks={removedTracks}
            onDeleteTrack={handleDeleteTrack}
            onRemoveAddedTrack={handleRemoveAddedTrack}
            addedTracks={addedTracks}
            onRename={handleRenamePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
