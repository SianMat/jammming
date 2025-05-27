import { useEffect, useState } from "react";
import "./App.css";
import TrackList from "../src/components/TrackList";
import Playlist from "./components/Playlist.jsx";
import FetchTracks from "./utils/FetchTracks.js";
import SearchBar from "./components/SearchBar.jsx";
import Login from "./components/LogIn.jsx";
import { getPlaylists, getPlaylistById } from "./utils/FetchPlaylists.js";
import { searchSpotify } from "./utils/FetchTracks.js";

function App() {
  const [profile, setProfile] = useState(null);

  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistName, setPlayListName] = useState("");
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
          />
        </div>
      </div>
    </div>
  );
}

export default App;
