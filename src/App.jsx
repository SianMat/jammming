import { useDebugValue, useEffect, useState } from "react";
import "./App.css";
import TrackList from "../src/components/TrackList";
import Playlist from "./components/PlayList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Login from "./components/LogIn.jsx";
import { getPlaylists, getPlaylistById } from "./utils/FetchPlaylists.js";
import { searchSpotify } from "./utils/FetchTracks.js";
import { renamePlaylist } from "./utils/UpdatePlaylist.js";
import {
  createPlaylistAndAddTracks,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  deletePlaylist,
} from "./utils/UpdatePlaylist.js";

function App() {
  const [profile, setProfile] = useState(null);

  const [tracks, setTracks] = useState([]); //tracks from search
  const [searchTerm, setSearchTerm] = useState("");
  const [playlists, setPlaylists] = useState([]); //list of all user playlists
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null); //tracks of selected playlist

  const [playlistName, setPlayListName] = useState(""); //name of selected playlist
  const [playlistId, setPlaylistId] = useState(""); //id of selected playlist
  useEffect(() => {
    setPlayListName(playlists.find((p) => p.id === playlistId)?.name || "");
  }, [playlistId]);

  const [addedTracks, setAddedTracks] = useState([]);
  const [removedTracks, setRemovedTracks] = useState([]);

  const [newPlaylist, setNewPlaylist] = useState(false); //determine whether playlist name and tracks are for new or existing playlist
  useEffect(() => {
    if (newPlaylist) {
      setPlayListName("");
      setSelectedPlaylistTracks([]);
    } else if (playlists.length > 0) {
      handleFetchPlaylist(playlists[0].id);
    }
    setAddedTracks([]);
    setRemovedTracks([]);
  }, [newPlaylist]);

  //search Spotify based on key word
  async function handleSearch() {
    const results = await searchSpotify(searchTerm);
    setTracks(results);
  }

  //fetch tracks for users selected playlist : defaults to top in list
  async function handleFetchPlaylist(pltId) {
    if (pltId) {
      const playlistTracks = await getPlaylistById(pltId);
      setSelectedPlaylistTracks(playlistTracks);
      setPlaylistId(pltId);
      setAddedTracks([]);
      setRemovedTracks([]);
    }
  }

  //fetch playlists of logged in user
  async function handleFetchPlaylists() {
    const results = await getPlaylists();
    setPlaylists(results);
    if (results.length > 0) {
      handleFetchPlaylist(results[0].id);
    }
  }

  // Delete existing track from playlist and move to search list
  function handleDeleteTrack(trackId) {
    if (!removedTracks.map((t) => t.id).includes(trackId)) {
      setRemovedTracks((prev) => [
        selectedPlaylistTracks
          .map((t) => t.track)
          .find((track) => track.id === trackId),
        ...prev,
      ]);
    }
  }

  // Add new track to playlist
  function handleAddTrack(trackId) {
    if (
      !addedTracks.map((t) => t.id).includes(trackId) &&
      !selectedPlaylistTracks.map((t) => t.track.id).includes(trackId)
    ) {
      setAddedTracks((prev) => [
        tracks.find((track) => track.id === trackId),
        ...prev,
      ]);
    }
  }

  // Remove track that was added but not yet saved and move back into search list
  function handleRemoveAddedTrack(trackId) {
    setAddedTracks((prev) => prev.filter((track) => track.id !== trackId));
  }

  // Add track back into playlist that was removed but not saved
  function handleAddRemovedTrack(trackId) {
    setRemovedTracks((prev) => prev.filter((track) => track.id !== trackId));
  }

  // call to spotify API to rename playlist
  async function handleRenamePlaylist() {
    const success = await renamePlaylist(playlistId, playlistName);
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

  // call to spotify API to save new tracks
  async function handleSaveNewTracks() {
    const success = await addTracksToPlaylist(
      playlistId,
      addedTracks.map((t) => t.uri)
    );
    if (success) {
      handleFetchPlaylist(playlistId);
    }
  }

  // call to spotify API to remove tracks
  async function handleSaveDeletedTracks() {
    const success = await removeTracksFromPlaylist(
      playlistId,
      removedTracks.map((t) => t.uri)
    );
    if (success) {
      handleFetchPlaylist(playlistId);
    }
  }

  // save all changes to existing playlist
  async function handleSaveChangesToExistingPlaylist() {
    const existingPlaylist = playlists.find((p) => p.id === playlistId);
    if (existingPlaylist) {
      if (existingPlaylist.name !== playlistName) {
        handleRenamePlaylist();
      }
      if (addedTracks.length > 0) {
        handleSaveNewTracks();
      }
      if (removedTracks.length > 0) {
        handleSaveDeletedTracks();
      }
    } else {
      console.log("playlist not found");
    }
  }

  //display empty playlist
  function handleAddNewPlaylist() {
    setNewPlaylist((prev) => {
      return !prev;
    });
  }

  //call to spotify API to save new playlist
  async function handleSaveNewPlaylist() {
    const result = await createPlaylistAndAddTracks(playlistName, addedTracks);
    setPlaylists((prev) => [result, ...prev]);
    setNewPlaylist(false);
    handleFetchPlaylist(result.id);
  }

  // handle button click to either save or update playlist
  function handleUpdatePlaylist() {
    if (newPlaylist) {
      handleSaveNewPlaylist();
    } else {
      handleSaveChangesToExistingPlaylist();
    }
  }

  // call to spotify API to delete a playlist
  function handleDeletePlaylist() {
    const success = deletePlaylist(playlistId);
    if (success) {
      setPlaylists((prev) => {
        const updated = prev.filter((p) => p.id !== playlistId);
        const top = updated[0];
        if (top) {
          handleFetchPlaylist(top.id);
        }
        return updated;
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
        onAddNewPlaylist={handleAddNewPlaylist}
        newPlaylist={newPlaylist}
        playlistId={playlistId}
        loggedIn={profile ? true : false}
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
          {profile ? (
            <Playlist
              playlistName={playlistName}
              setPlaylistName={setPlayListName}
              playlist={selectedPlaylistTracks}
              removedTracks={removedTracks}
              onDeleteTrack={handleDeleteTrack}
              onRemoveAddedTrack={handleRemoveAddedTrack}
              addedTracks={addedTracks}
              onSave={handleUpdatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
