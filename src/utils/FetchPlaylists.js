const baseAddress = "https://api.spotify.com/v1";

async function fetchPlaylists(token) {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await res.json();
  return data.items; // array of playlists
}

export async function getPlaylists() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.log("No access token found. Please log in first.");
    return [];
  }

  try {
    const data = await fetchPlaylists(token);
    return data;
  } catch (err) {
    console.log("error fetching playlists");
    console.log(err.message);
  }
  return [];
}

async function fetchPlaylistTracks(token, playlistId) {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch playlist tracks");
  }

  const data = await res.json();
  return data.items; // Array of track objects
}

export async function getPlaylistById(playlistId) {
  const token = localStorage.getItem("spotify_access_token");
  if (!token || !playlistId) {
    console.log("Please log in first.");
    return;
  }
  try {
    const tracks = await fetchPlaylistTracks(token, playlistId);
    return tracks;
  } catch (err) {
    console.log("error fetching tracks for playlist");
    console.log(err.message);
  }
  return;
}
