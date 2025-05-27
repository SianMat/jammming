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
