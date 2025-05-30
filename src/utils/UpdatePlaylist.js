async function updatePlaylistName(token, playlistId, newName) {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to update playlist");
  }
}

export async function renamePlaylist(playlistId, newName) {
  const token = localStorage.getItem("spotify_access_token");
  try {
    await updatePlaylistName(token, playlistId, newName);
    console.log("Playlist renamed successfully!");
    return true;
  } catch (err) {
    console.log("Error: " + err.message);
    return false;
  }
}

//fetch userId
async function getUserId(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.id; // the user's Spotify user ID
}

// Delete playlist
export async function deletePlaylist(playlistId) {
  const token = localStorage.getItem("spotify_access_token");

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }

  return true; // success
}


// Create a new playlist
async function createPlaylist(userId, token, playlistName) {
  const body = {
    name: playlistName,
    public: false,
  };

  const res = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }

  return await res.json(); // returns new playlist object (includes id)
}

// Add tracks to a playlist
export async function addTracksToPlaylist(playlistId, trackUris) {
  const token = localStorage.getItem("spotify_access_token");

  const body = {
    uris: trackUris, // array of Spotify track URIs, e.g. ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"]
  };

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }

  return true; //return success
}

// Remove tracks from playlist
export async function removeTracksFromPlaylist(playlistId, trackUris) {
  const token = localStorage.getItem("spotify_access_token");

  const body = {
    tracks: trackUris.map((uri) => ({ uri })), // array of Spotify track URIs, e.g. ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"]
  };

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }

  return true; // return success
}

// Combined function to create new playlist and add tracks
export async function createPlaylistAndAddTracks(playlistName, tracks) {
  const trackUris = tracks.map((t) => t.uri);
  const token = localStorage.getItem("spotify_access_token");

  const userId = await getUserId(token);
  const playlist = await createPlaylist(userId, token, playlistName);
  const playlistId = playlist.id;

  if (trackUris && trackUris.length > 0) {
    await addTracksToPlaylist(playlistId, trackUris);
  }

  return playlist;
}
