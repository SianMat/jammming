import { useEffect, useState } from "react";
import "./App.css";
import TrackList from "../src/components/TrackList";
import Playlist from "./components/Playlist.jsx";
import FetchTracks from "./utils/FetchTracks.js";
import SearchBar from "./components/SearchBar.jsx";
import { FetchPlaylists, FetchPlaylist } from "./utils/FetchPlaylists.js";

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistName, setPlayListName] = useState("");
  const [addedTracks, setAddedTracks] = useState([]);
  const [removedTracks, setRemovedTracks] = useState([]);

  function fetchTracks() {
    setTracks(FetchTracks());
  }

  function fetchPlaylist(playlistId) {
    const playlist = FetchPlaylist();
    setSelectedPlaylist(playlist);
    setPlayListName(playlist.name);
  }

  function fetchPlayLists() {
    const listOfPlaylists = FetchPlaylists();
    setPlaylists(listOfPlaylists);
    if (listOfPlaylists && listOfPlaylists.length > 0) {
      fetchPlaylist(listOfPlaylists[0].id);
    }
  }

  useEffect(() => {
    fetchTracks();
    fetchPlayLists();
  }, []);

  function handleDeleteTrack(trackId) {
    if (!removedTracks.map((t) => t.id).includes(trackId)) {
      setRemovedTracks((prev) => [
        selectedPlaylist.tracks.items
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
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectPlaylist={fetchPlaylist}
        playlists={playlists}
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
