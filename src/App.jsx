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
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  function fetchTracks() {
    setTracks(FetchTracks());
  }

  function fetchPlaylist(playlistId) {
    const playlist = FetchPlaylist();
    setSelectedPlaylist(playlist);
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

  return (
    <div className="container">
      <div className="row py-3">
        <div className="col">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TrackList tracks={tracks} />
        </div>
        <div className="col">
          <Playlist
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            onSelectPlaylist={fetchPlaylist}
            tracks={
              selectedPlaylist
                ? selectedPlaylist.tracks.items.map((item) => item.track)
                : []
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
