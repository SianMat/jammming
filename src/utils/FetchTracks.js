export async function searchTracks(token, query) {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: 20, // You can adjust the number of results
  });

  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to search tracks");
  }

  const data = await res.json();
  return data.tracks.items; // Returns array of track objects
}

export async function searchSpotify(query) {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    console.log("Please log in first.");
    return [];
  }
  if (!query.trim()) return [];

  try {
    const tracks = await searchTracks(token, query);
    return tracks;
  } catch (err) {
    console.log(err.message);
  }
}
